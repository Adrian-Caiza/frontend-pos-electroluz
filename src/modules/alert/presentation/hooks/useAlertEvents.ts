import { useEffect, useRef } from 'react';
import { useAlertStore, alertKey } from '../store/useAlertStore';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { toast } from 'sonner';
import { mapToAlert } from '../../infrastructure/services/alertApi';
import type { Alert } from '../../domain/entities/Alert';

const POLL_INTERVAL_MS = 30_000; // 30 seconds

export const useAlertEvents = () => {
  const addAlert = useAlertStore((s) => s.addAlert);
  const setUnreadAlerts = useAlertStore((s) => s.setUnreadAlerts);
  const undismissKeys = useAlertStore((s) => s.undismissKeys);
  const token = useAuthStore((s) => s.token);
  const userRole = useAuthStore((s) => s.user?.usrol);

  const tokenRef = useRef(token);
  tokenRef.current = token;

  // All product+branch keys we've seen from the backend during this session.
  // Used to determine if a key is "genuinely new" vs "recreated by the 5-min batch".
  const knownKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!token || !userRole) return;
    const allowedRoles = ['jefe', 'empleado', 'administrador'];
    if (!allowedRoles.includes(userRole)) return;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const abortController = new AbortController();

    // ──────────────────────────────────────────────────────────────
    // Fetch ALL visible alerts from the backend (both read & unread)
    // ──────────────────────────────────────────────────────────────
    const fetchAllAlerts = async (): Promise<Alert[]> => {
      const currentToken = tokenRef.current;
      if (!currentToken) return [];

      const response = await fetch(`${API_URL}/alerts?page=1&pageSize=50`, {
        headers: { 'Authorization': `Bearer ${currentToken}` },
        signal: abortController.signal,
      });

      if (!response.ok) return [];
      const data = await response.json();
      return data.items?.map(mapToAlert) || [];
    };

    // ──────────────────────────────────────────────────────────────
    // Initial load
    // ──────────────────────────────────────────────────────────────
    const initialize = async () => {
      try {
        const allAlerts = await fetchAllAlerts();
        if (abortController.signal.aborted) return;

        // Register all current product+branch keys as "known" — no toasts on first load
        for (const alert of allAlerts) {
          knownKeysRef.current.add(alertKey(alert));
        }

        // Put only non-dismissed alerts into the bell
        const { dismissedKeys } = useAlertStore.getState();
        const unread = allAlerts.filter(a => !dismissedKeys.includes(alertKey(a)));
        setUnreadAlerts(unread);
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          console.error('Error fetching initial alerts:', e);
        }
      }

      if (!abortController.signal.aborted) {
        connectSSE();
      }
    };

    // ──────────────────────────────────────────────────────────────
    // Periodic sync — the core fix for recurring low-stock alerts
    //
    // The backend destroys & recreates ALL alerts every ~5 min with
    // new alid values but the same product+branch combinations.
    // We track by product+branch key, NOT by alid.
    // ──────────────────────────────────────────────────────────────
    const syncAlerts = async () => {
      try {
        const allAlerts = await fetchAllAlerts();
        if (abortController.signal.aborted) return;

        const currentKeys = new Set(allAlerts.map(alertKey));
        const { dismissedKeys } = useAlertStore.getState();

        // 1. Keys that DISAPPEARED from the backend → product went above min stock
        //    Remove them from dismissedKeys so if they drop again we re-notify
        const disappeared = dismissedKeys.filter(k => !currentKeys.has(k));
        if (disappeared.length > 0) {
          undismissKeys(disappeared);
        }

        // 2. Keys that are GENUINELY NEW (not previously known, not dismissed)
        //    → show toast notification
        const updatedDismissed = useAlertStore.getState().dismissedKeys;
        for (const alert of allAlerts) {
          const key = alertKey(alert);
          if (!knownKeysRef.current.has(key) && !updatedDismissed.includes(key)) {
            toast.warning('Nueva Alerta: ' + alert.message, {
              description: alert.branch?.name ? `Sucursal: ${alert.branch.name}` : undefined,
              duration: 5000,
            });
          }
        }

        // 3. Update known keys (also forgets disappeared keys so they
        //    trigger toasts if they reappear later)
        knownKeysRef.current = currentKeys;

        // 4. Sync the store with the latest alerts (fresh alid values),
        //    filtered by dismissedKeys
        const finalDismissed = useAlertStore.getState().dismissedKeys;
        const unread = allAlerts.filter(a => !finalDismissed.includes(alertKey(a)));
        setUnreadAlerts(unread);
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          console.error('Error syncing alerts:', e);
        }
      }
    };

    // ──────────────────────────────────────────────────────────────
    // SSE: real-time stream for instant notifications
    // ──────────────────────────────────────────────────────────────
    const connectSSE = async () => {
      try {
        const currentToken = tokenRef.current;
        if (!currentToken) return;

        const response = await fetch(`${API_URL}/alerts/events`, {
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Accept': 'text/event-stream'
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
                  const key = alertKey(alertData);

                  const { dismissedKeys } = useAlertStore.getState();

                  // Skip alerts the user already dismissed
                  if (dismissedKeys.includes(key)) continue;

                  const isNewKey = !knownKeysRef.current.has(key);
                  knownKeysRef.current.add(key);

                  const state = useAlertStore.getState();
                  const isDuplicate = state.unreadAlerts.some(a => a.id === alertData.id);

                  if (!isDuplicate) {
                    addAlert(alertData);
                    if (isNewKey) {
                      toast.warning('Nueva Alerta: ' + alertData.message, {
                        description: alertData.branch?.name ? `Sucursal: ${alertData.branch.name}` : undefined,
                        duration: 5000,
                      });
                    }
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
        if (!abortController.signal.aborted) {
          setTimeout(connectSSE, 5000);
        }
      }
    };

    initialize();

    const pollInterval = setInterval(syncAlerts, POLL_INTERVAL_MS);

    return () => {
      abortController.abort();
      clearInterval(pollInterval);
    };
  }, [token, userRole, addAlert, setUnreadAlerts, undismissKeys]);
};
