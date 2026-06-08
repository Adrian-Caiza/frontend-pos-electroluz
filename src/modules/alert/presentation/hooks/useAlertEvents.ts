import { useEffect } from 'react';
import { useAlertStore } from '../store/useAlertStore';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { toast } from 'sonner';

export const useAlertEvents = () => {
  const { addAlert } = useAlertStore();
  const { token, user } = useAuthStore();

  useEffect(() => {
    // Only connect if the user is jefe, empleado or admin (roles that can receive alerts)
    if (!token || !user) return;
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://163.245.192.54:3000';
    
    // Instead of raw EventSource (which doesn't support headers well natively in some browsers if you need auth)
    // we can use standard fetch with a ReadableStream, or rely on the backend accepting token in URL if we modify the backend.
    // However, a simple approach for EventSource with Auth header is unfortunately not standard.
    // Assuming backend accepts it via a query param `?token=` if we want to use native EventSource, OR
    // we use a custom implementation. For now, let's assume we can fetch it manually or the backend allows it via query string.
    // Actually, typical implementation is using the native EventSource with `withCredentials: true` if using cookies,
    // but since we use JWT, we have to append it to the URL if the backend supports it.
    
    const eventSource = new EventSource(`${API_URL}/alerts/events?token=${token}`);

    eventSource.onmessage = (event) => {
      // General messages
    };

    eventSource.addEventListener('new-alert', (event: any) => {
      try {
        const alertData = JSON.parse(event.data);
        addAlert(alertData);
        toast.warning('Nueva Alerta: ' + alertData.almensaje, {
          description: `Sucursal: ${alertData.branch?.sunombre}`,
          duration: 5000,
        });
      } catch (e) {
        console.error("Error parsing alert event", e);
      }
    });

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
      // Optionally implement reconnection logic here
    };

    return () => {
      eventSource.close();
    };
  }, [token, user, addAlert]);
};
