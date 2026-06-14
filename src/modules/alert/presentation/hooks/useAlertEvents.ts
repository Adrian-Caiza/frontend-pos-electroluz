import { useEffect, useRef } from 'react';
import { useAlertStore } from '../store/useAlertStore';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { toast } from 'sonner';
import { mapToAlert } from '../../infrastructure/services/alertApi';

export const useAlertEvents = () => {
  const addAlert = useAlertStore((s) => s.addAlert);
  const setUnreadAlerts = useAlertStore((s) => s.setUnreadAlerts);
  const token = useAuthStore((s) => s.token);
  const userRole = useAuthStore((s) => s.user?.usrol);

  // Keep token in a ref so SSE reconnection always uses the latest value
  const tokenRef = useRef(token);
  tokenRef.current = token;

  useEffect(() => {
    if (!token || !userRole) return;
    const allowedRoles = ['jefe', 'empleado', 'administrador'];
    if (!allowedRoles.includes(userRole)) return;

    // Usamos el proxy para evitar problemas de CORS/CORP en el navegador
    const API_URL = '/api-proxy';
    const abortController = new AbortController();

    // ──────────────────────────────────────────────────────────────
    // Initial load: populate the bell with currently unread alerts.
    // No toasts here — the user just loaded the page.
    // ──────────────────────────────────────────────────────────────
    const fetchInitialUnread = async () => {
      try {
        const response = await fetch(`${API_URL}/alerts?page=1&pageSize=50`, {
          headers: { 'Authorization': `Bearer ${token}` },
          signal: abortController.signal,
        });
        if (response.ok) {
          const data = await response.json();
          const unread = data.items
            ?.filter((item: any) => item.alvisto === false)
            .map(mapToAlert) || [];
          if (!abortController.signal.aborted) {
            setUnreadAlerts(unread);
          }
        }
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          console.error('Error fetching initial alerts:', e);
        }
      }
    };

    // ──────────────────────────────────────────────────────────────
    // SSE: real-time stream for periodic reminders.
    //
    // The backend creates alerts every ~5 min for products below
    // minimum stock and sends them via SSE. Every event is a
    // legitimate reminder → show a toast and update the bell.
    //
    // Dedup: if the same alid arrives twice (SSE internal re-poll),
    // the store already has it → isDuplicate → no double toast.
    // When a new 5-min batch creates new alids, isDuplicate is
    // false → toast fires → this is the periodic reminder.
    // ──────────────────────────────────────────────────────────────
    const connectSSE = async () => {
      try {
        const currentToken = tokenRef.current;
        if (!currentToken) return;

        const response = await fetch(`${API_URL}/alerts/events`, {
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Accept': 'text/event-stream',
          },
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`SSE connection failed: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('SSE response body is not readable');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const messages = buffer.split(/\r?\n\r?\n/);
          buffer = messages.pop() || '';

          for (const msg of messages) {
            if (!msg.trim() || msg.trim().startsWith(':')) continue;

            if (msg.includes('event: new-alert') || msg.includes('event:new-alert')) {
              const dataLines = msg
                .split(/\r?\n/)
                .filter(line => line.startsWith('data:'))
                .map(line => line.startsWith('data: ') ? line.substring(6) : line.substring(5));

              if (dataLines.length > 0) {
                const jsonStr = dataLines.join('\n');
                try {
                  const parsed = JSON.parse(jsonStr);
                  const alertData = mapToAlert(parsed);

                  // Check if this exact alid is already in the store
                  // (prevents double-toasting within the same 5-min cycle)
                  const state = useAlertStore.getState();
                  const isDuplicate = state.unreadAlerts.some(a => a.id === alertData.id);

                  // addAlert replaces by product+branch key (keeps latest alid)
                  addAlert(alertData);

                  if (!isDuplicate) {
                    toast.warning('Nueva Alerta: ' + alertData.message, {
                      description: alertData.branch?.name
                        ? `Sucursal: ${alertData.branch.name}`
                        : undefined,
                      duration: 5000,
                    });
                  }
                } catch (e) {
                  console.error('Error parsing alert event JSON', e);
                }
              }
            }
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('SSE connection error:', error);
        }
      } finally {
        // Reconnect after disconnect (unless the component unmounted)
        if (!abortController.signal.aborted) {
          setTimeout(connectSSE, 5000);
        }
      }
    };

    // Bootstrap: initial fetch → SSE
    const initialize = async () => {
      await fetchInitialUnread();
      if (!abortController.signal.aborted) {
        connectSSE();
      }
    };

    initialize();

    return () => {
      abortController.abort();
    };
  }, [token, userRole, addAlert, setUnreadAlerts]);
};
