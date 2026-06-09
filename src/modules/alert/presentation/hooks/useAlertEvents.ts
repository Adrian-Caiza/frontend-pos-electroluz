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

  // Keep token in a ref so the SSE reconnection always uses the latest value
  const tokenRef = useRef(token);
  tokenRef.current = token;

  useEffect(() => {
    // Only connect if the user is jefe, empleado or admin (roles that can receive alerts)
    if (!token || !userRole) return;
    const allowedRoles = ['jefe', 'empleado', 'administrador'];
    if (!allowedRoles.includes(userRole)) return;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const abortController = new AbortController();

    const fetchInitialUnread = async () => {
      try {
        const response = await fetch(`${API_URL}/alerts?page=1&pageSize=50`, {
          headers: { 'Authorization': `Bearer ${token}` },
          signal: abortController.signal,
        });
        if (response.ok) {
          const data = await response.json();
          const unread = data.items?.filter((item: any) => item.alvisto === false).map(mapToAlert) || [];
          // Guard: don't set state if the effect has been cleaned up
          if (!abortController.signal.aborted) {
            setUnreadAlerts(unread);
          }
        }
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          console.error("Error fetching initial alerts:", e);
        }
      }
    };

    const connectSSE = async () => {
      try {
        // Always use the latest token for reconnections
        const currentToken = tokenRef.current;
        if (!currentToken) return;

        const response = await fetch(`${API_URL}/alerts/events`, {
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Accept': 'text/event-stream'
          },
          signal: abortController.signal
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

          // Split by either \n\n or \r\n\r\n to ensure instant processing regardless of line endings
          const messages = buffer.split(/\r?\n\r?\n/);
          buffer = messages.pop() || ''; // Keep the incomplete chunk

          for (const msg of messages) {
            if (!msg.trim() || msg.trim().startsWith(':')) continue;

            if (msg.includes('event: new-alert') || msg.includes('event:new-alert')) {
              // Robust data parsing: handle both "data: " (with space) and "data:" (without space)
              const dataLines = msg
                .split(/\r?\n/)
                .filter(line => line.startsWith('data:'))
                .map(line => line.startsWith('data: ') ? line.substring(6) : line.substring(5));

              if (dataLines.length > 0) {
                const jsonStr = dataLines.join('\n');
                try {
                  const parsed = JSON.parse(jsonStr);
                  const alertData = mapToAlert(parsed);

                  const state = useAlertStore.getState();
                  const isDuplicate = state.unreadAlerts.some(a => a.id === alertData.id);
                  const isViewed = state.viewedAlertIds.includes(alertData.id);

                  // If the backend sends an alert we've already marked as read, ignore it.
                  // If it's already in unreadAlerts, we don't need to show a toast again.
                  if (!isDuplicate && !isViewed && !alertData.isViewed) {
                    addAlert(alertData);
                    toast.warning('Nueva Alerta: ' + alertData.message, {
                      description: alertData.branch?.name ? `Sucursal: ${alertData.branch.name}` : undefined,
                      duration: 5000,
                    });
                  }
                } catch (e) {
                  console.error("Error parsing alert event JSON", e);
                }
              }
            }
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("SSE connection error:", error);
        }
      } finally {
        // Automatic Reconnection Logic
        if (!abortController.signal.aborted) {
          setTimeout(connectSSE, 5000);
        }
      }
    };

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
