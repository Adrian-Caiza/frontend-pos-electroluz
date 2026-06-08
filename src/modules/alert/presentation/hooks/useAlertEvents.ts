import { useEffect } from 'react';
import { useAlertStore } from '../store/useAlertStore';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { toast } from 'sonner';
import { mapToAlert } from '../../infrastructure/services/alertApi';

export const useAlertEvents = () => {
  const { addAlert, setUnreadAlerts } = useAlertStore();
  const { token, user } = useAuthStore();

  useEffect(() => {
    // Only connect if the user is jefe, empleado or admin (roles that can receive alerts)
    if (!token || !user) return;
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const abortController = new AbortController();

    const fetchInitialUnread = async () => {
      try {
        const response = await fetch(`${API_URL}/alerts?page=1&pageSize=50`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const unread = data.items?.filter((item: any) => item.alvisto === false).map(mapToAlert) || [];
          setUnreadAlerts(unread);
        }
      } catch (e) {
        console.error("Error fetching initial alerts:", e);
      }
    };

    const connectSSE = async () => {
      try {
        const response = await fetch(`${API_URL}/alerts/events`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'text/event-stream'
          },
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error(`SSE connection failed: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) return;

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
            if (msg.trim() === ':keepalive' || !msg.trim()) continue;

            if (msg.includes('event: new-alert')) {
              // Split the message lines by \r?\n to find the data line
              const dataLine = msg.split(/\r?\n/).find(line => line.startsWith('data: '));
              if (dataLine) {
                const jsonStr = dataLine.substring(6); // remove 'data: '
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
          console.error("EventSource fetch failed:", error);
          // Simple reconnection logic could go here if needed
        }
      }
    }; // Close connectSSE

    const initialize = async () => {
      await fetchInitialUnread();
      connectSSE();
    };

    initialize();

    return () => {
      abortController.abort();
    };
  }, [token, user, addAlert, setUnreadAlerts]);
};
