import { useEffect, useRef } from 'react';
import { useAlertStore } from '../store/useAlertStore';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { toast } from 'sonner';
import { mapToAlert, alertApi } from '../../infrastructure/services/alertApi';

export const useAlertEvents = () => {
  const addAlert = useAlertStore((s) => s.addAlert);
  const setUnreadAlerts = useAlertStore((s) => s.setUnreadAlerts);
  const token = useAuthStore((s) => s.token);
  const userRole = useAuthStore((s) => s.user?.usrol);

  const tokenRef = useRef(token);
  tokenRef.current = token;

  // Ref to track IDs we've already shown toasts for in the current cycle
  const knownAlertIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!token || !userRole) return;
    const allowedRoles = ['jefe', 'empleado', 'administrador'];
    if (!allowedRoles.includes(userRole)) return;

    // We use the proxy to avoid CORS/CORP in development, 
    // but in Vercel it may return 502 for long-lived SSE connections.
    const isDev = import.meta.env.DEV;
    const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const API_URL = isDev ? '/api-proxy' : rawApiUrl.replace(/\/+$/, '');
    
    const abortController = new AbortController();
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    let sseActive = false;

    // ──────────────────────────────────────────────────────────────
    // 1. Fetch de las alertas actuales (Actualiza campana, sin toasts)
    // ──────────────────────────────────────────────────────────────
    const fetchAlerts = async (showToasts: boolean = false) => {
      try {
        const data = await alertApi.getAlerts(1, 50);
        
        const unread = data.items.filter((item: any) => item.isViewed === false);
          
        if (!abortController.signal.aborted) {
          setUnreadAlerts(unread);
          
          // Si es un chequeo por polling, verificamos si hay alertas nuevas para mostrar toast
          if (showToasts) {
            const currentIds = new Set<string>();
            unread.forEach((alert: any) => {
              currentIds.add(alert.id);
              if (!knownAlertIdsRef.current.has(alert.id)) {
                toast.warning('Nueva Alerta: ' + alert.message, {
                  description: alert.branch?.name ? `Sucursal: ${alert.branch.name}` : undefined,
                  duration: 5000,
                });
              }
            });
            knownAlertIdsRef.current = currentIds;
          } else {
            // Si es la carga inicial, simplemente memorizamos los IDs actuales
            unread.forEach((alert: any) => knownAlertIdsRef.current.add(alert.id));
          }
        }
      } catch (e: any) {
        if (e.name !== 'AbortError') console.error('Error fetching alerts:', e);
      }
    };

    // ──────────────────────────────────────────────────────────────
    // 2. Conexión SSE principal
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

        sseActive = true;
        
        // Si SSE funciona, nos aseguramos de apagar el polling fallback
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
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
              const dataLines = msg
                .split(/\r?\n/)
                .filter(line => line.startsWith('data:'))
                .map(line => line.startsWith('data: ') ? line.substring(6) : line.substring(5));

              if (dataLines.length > 0) {
                const jsonStr = dataLines.join('\n');
                try {
                  const parsed = JSON.parse(jsonStr);
                  const alertData = mapToAlert(parsed);

                  // Verificamos si este ID específico ya llegó para evitar toasts duplicados
                  const state = useAlertStore.getState();
                  const isDuplicate = state.unreadAlerts.some(a => a.id === alertData.id);

                  // addAlert reemplaza por Producto+Sucursal para actualizar el ID en la campana
                  addAlert(alertData);
                  knownAlertIdsRef.current.add(alertData.id);

                  if (!isDuplicate) {
                    toast.warning('Nueva Alerta: ' + alertData.message, {
                      description: alertData.branch?.name ? `Sucursal: ${alertData.branch.name}` : undefined,
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
        if (!abortController.signal.aborted) {
          // Intentamos reconectar SSE en el fondo cada 15s por si el servidor revive
          setTimeout(connectSSE, 15000);
        }
      }
    };

    // Inicializamos: primero llenamos la campana y luego intentamos SSE
    fetchAlerts(false).then(() => {
      if (!abortController.signal.aborted) {
        connectSSE();
      }
    });

    // ACTIVAMOS EL POLLING SIEMPRE EN PARALELO (cada 15s)
    // Razón: NGINX acepta la conexión SSE (200 OK) pero retiene el body.
    // Esto hace que `reader.read()` se quede colgado indefinidamente sin arrojar error,
    // retrasando el fallback. Al correr en paralelo, garantizamos la entrega.
    pollInterval = setInterval(() => fetchAlerts(true), 15000);

    return () => {
      abortController.abort();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [token, userRole, addAlert, setUnreadAlerts]);
};