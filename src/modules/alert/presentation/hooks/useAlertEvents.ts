import { useEffect, useRef } from 'react';
import { useAlertStore } from '../store/useAlertStore';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { toast } from 'sonner';
import { alertApi } from '../../infrastructure/services/alertApi';

const POLL_INTERVAL_MS = 15_000; // 15 seconds

export const useAlertEvents = () => {
  const addAlert = useAlertStore((s) => s.addAlert);
  const setUnreadAlerts = useAlertStore((s) => s.setUnreadAlerts);
  const token = useAuthStore((s) => s.token);
  const userRole = useAuthStore((s) => s.user?.usrol);

  const tokenRef = useRef(token);
  tokenRef.current = token;

  // Track product+branch keys we've already shown toasts for in the current batch.
  // When the backend recreates alerts every ~5 min, the alid values change but
  // the product+branch combinations stay the same. We use those keys to detect
  // genuinely new alerts vs. the same batch being re-fetched within the 5-min window.
  const knownKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!token || !userRole) return;
    const allowedRoles = ['jefe', 'empleado', 'administrador'];
    if (!allowedRoles.includes(userRole)) return;

    const abortController = new AbortController();

    // Helper: stable key for a product+branch (survives backend re-creation of alerts)
    const stableKey = (alert: { product?: { id: string }; branch?: { id: string } }) =>
      `${alert.product?.id || ''}_${alert.branch?.id || ''}`;

    // ──────────────────────────────────────────────────────────────
    // Fetch alerts using apiClient (handles auth, token refresh, CORS)
    // ──────────────────────────────────────────────────────────────
    const fetchAlerts = async (showToasts: boolean) => {
      try {
        const data = await alertApi.getAlerts(1, 50);
        if (abortController.signal.aborted) return;

        // ALL visible alerts go in the bell — the alert system works as periodic
        // reminders until the stock is replenished. We don't filter by isViewed
        // because the backend recreates alerts every ~5 min as reminders.
        const allAlerts = data.items;
        setUnreadAlerts(allAlerts);

        if (showToasts) {
          // Compare current product+branch keys with known ones.
          // If a key is new (not seen before), show a toast — it's a new reminder cycle.
          const currentKeys = new Set<string>();
          for (const alert of allAlerts) {
            const key = stableKey(alert);
            currentKeys.add(key);
            if (!knownKeysRef.current.has(key)) {
              toast.warning('Nueva Alerta: ' + alert.message, {
                description: alert.branch?.name ? `Sucursal: ${alert.branch.name}` : undefined,
                duration: 5000,
              });
            }
          }

          // Keys that disappeared → product went above min stock → forget them
          // so they trigger toasts again if they reappear.
          // Keys that are still present → keep them (no re-toast within same cycle).
          knownKeysRef.current = currentKeys;
        } else {
          // Initial load — just memorize keys, no toasts
          for (const alert of allAlerts) {
            knownKeysRef.current.add(stableKey(alert));
          }
        }
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          console.error('Error fetching alerts:', e);
        }
      }
    };

    // ──────────────────────────────────────────────────────────────
    // SSE: real-time stream (works locally, may be blocked by proxies in prod)
    // ──────────────────────────────────────────────────────────────
    const connectSSE = async () => {
      try {
        const currentToken = tokenRef.current;
        if (!currentToken) return;

        // In dev we use the Vite proxy, in prod we hit the API directly.
        const isDev = import.meta.env.DEV;
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const sseUrl = isDev
          ? '/api-proxy/alerts/events'
          : `${rawApiUrl.replace(/\/+$/, '')}/alerts/events`;

        const response = await fetch(sseUrl, {
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
        if (!reader) throw new Error('SSE response body is not readable');

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
              // When SSE delivers an alert, trigger a full refresh so the bell
              // and toast logic stays consistent with the polling path.
              await fetchAlerts(true);
              break; // One refresh per SSE batch is enough
            }
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('SSE connection error (falling back to polling):', error);
        }
      } finally {
        // Reconnect SSE after disconnect
        if (!abortController.signal.aborted) {
          setTimeout(connectSSE, 15_000);
        }
      }
    };

    // ──────────────────────────────────────────────────────────────
    // Bootstrap: initial fetch → SSE + polling
    // ──────────────────────────────────────────────────────────────
    fetchAlerts(false).then(() => {
      if (!abortController.signal.aborted) {
        connectSSE();
      }
    });

    // Polling runs in parallel as the primary delivery mechanism.
    // SSE may be blocked by NGINX/Vercel proxies that buffer the stream,
    // so polling guarantees delivery regardless of deployment environment.
    const pollInterval = setInterval(() => fetchAlerts(true), POLL_INTERVAL_MS);

    return () => {
      abortController.abort();
      clearInterval(pollInterval);
    };
  }, [token, userRole, addAlert, setUnreadAlerts]);
};