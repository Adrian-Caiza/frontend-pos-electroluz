import { useEffect, useRef, useCallback } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useQueryClient } from '@tanstack/react-query';
import { useAlertStore } from '../store/useAlertStore';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { mapToAlert } from '../../infrastructure/services/alertApi';
import { toast } from 'sonner';
import { useAlertSummary } from './useAlertSummary';

export const useAlertEvents = () => {
  const token = useAuthStore((s) => s.token);
  const userRole = useAuthStore((s) => s.user?.usrol);
  const queryClient = useQueryClient();

  const {
    incrementUnseen,
    decrementUnseen,
    addBellAlert,
    updateBellAlert,
    removeBellAlert,
    setUnseenCount
  } = useAlertStore();

  
  const { data: summaryData } = useAlertSummary();

  useEffect(() => {
    if (summaryData) {
      setUnseenCount(summaryData.totalUnseen);
    }
  }, [summaryData, setUnseenCount]);

  const abortRef = useRef<AbortController | null>(null);

  const startSSE = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const sseUrl = `${rawApiUrl.replace(/\/+$/, '')}/alerts/events`;

    console.log('[AlertEvents] Connecting to SSE…', sseUrl);

    fetchEventSource(sseUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'text/event-stream',
      },
      signal: controller.signal,
      openWhenHidden: true,

      async onopen(response) {
        if (
          response.ok &&
          response.headers.get('content-type')?.includes('text/event-stream')
        ) {
          console.log('[AlertEvents] SSE connected ✓');
          return;
        }
        if (response.status === 401) {
          throw new Error('TOKEN_EXPIRED');
        }
        throw new Error(`SSE connection failed: ${response.status}`);
      },

      onmessage(event) {
        if (!event.data) return;

        console.log(`[AlertEvents] Raw message received | Event: ${event.event} | Data:`, event.data);

        const playNotificationSound = () => {
          try {
            const audio = new Audio('/sounds/dragon-studio-notification-sound-effect-372475.mp3');
            audio.play().catch(e => {
              
              console.warn('[AlertEvents] Audio play blocked:', e.message);
            });
          } catch (e) {
            console.error('[AlertEvents] Audio init failed:', e);
          }
        };

        const showGenericNotification = () => {
          
          toast.warning('Nuevas notificaciones', {
            id: 'generic-alert-toast',
            description: 'Revisa la campana para ver los detalles de inventario o sistema.',
            duration: 5000,
          });
          playNotificationSound();
        };

        try {
          const rawAlert = JSON.parse(event.data);
          const alert = mapToAlert(rawAlert);

          switch (event.event) {
            case 'alert-created':
            case 'new-alert':
              console.log('[AlertEvents] SSE event:', event.event, alert.message);

              
              const state = useAlertStore.getState();
              const alreadyExists = state.bellAlerts.some(a => a.id === alert.id);

              if (!alreadyExists) {
                incrementUnseen();
                showGenericNotification();
              }
              addBellAlert(alert);
              queryClient.invalidateQueries({ queryKey: ['alert-summary'] });
              queryClient.invalidateQueries({ queryKey: ['alerts'] });
              break;
            case 'alert-updated':
              console.log('[AlertEvents] SSE alert-updated:', alert.message);
              if (!alert.isViewed) {
                const state = useAlertStore.getState();
                const wasInBell = state.bellAlerts.some(a => a.id === alert.id);

                
                if (!wasInBell) {
                  showGenericNotification();
                }

                
                addBellAlert(alert);
              } else {
                
                removeBellAlert(alert.id);
              }
              
              queryClient.invalidateQueries({ queryKey: ['alert-summary'] });
              queryClient.invalidateQueries({ queryKey: ['alerts'] });
              break;
            case 'alert-resolved':
              console.log('[AlertEvents] SSE alert-resolved:', alert.message);
              if (!alert.isViewed) {
                decrementUnseen();
              }
              removeBellAlert(alert.id);
              queryClient.invalidateQueries({ queryKey: ['alert-summary'] });
              queryClient.invalidateQueries({ queryKey: ['alerts'] });
              break;
            case 'connected':
              console.log('[AlertEvents] SSE handshake received');
              break;
          }
        } catch (err) {
          console.error('[AlertEvents] Failed to parse SSE alert data:', err);
        }
      },

      onerror(err: any) {
        if (err.message === 'TOKEN_EXPIRED') {
          console.log('[AlertEvents] Token expired, executing refresh mechanism...');

          
          if (abortRef.current) {
            abortRef.current.abort();
          }

          const executeRefresh = async () => {
            try {
              const state = useAuthStore.getState();
              if (!state.refreshToken) throw new Error('No refresh token available');

              const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
              const res = await fetch(`${rawApiUrl}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: state.refreshToken })
              });

              if (!res.ok) {
                throw new Error(`Refresh failed with status ${res.status}`);
              }

              const data = await res.json();

              if (state.user && state.company) {
                state.setAuth(state.user, state.company, data.accessToken, data.refreshToken);
              }

            } catch (refreshErr) {
              console.error('[AlertEvents] SSE Refresh token failed -> logging out.', refreshErr);
              useAuthStore.getState().logout();
              window.location.href = '/auth/login';
            }
          };

          
          executeRefresh();

          return;
        }

        
        throw err;
      },

      onclose() {
        console.log('[AlertEvents] SSE closed by server.');
      },
    });
  }, [token, incrementUnseen, decrementUnseen, addBellAlert, updateBellAlert, removeBellAlert]);

  const closeSSE = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
  }, []);

  useEffect(() => {
    if (!token || !userRole) return;
    const allowedRoles = ['jefe', 'empleado', 'administrador'];
    if (!allowedRoles.includes(userRole)) return;

    startSSE();

    return () => closeSSE();
  }, [token, userRole, startSSE, closeSSE]);
};