import { Bell } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import { useAlertStore } from '../store/useAlertStore';
import { useAlertEvents } from '../hooks/useAlertEvents';
import { useMarkAlertAsViewed } from '../hooks/useMarkAlertAsViewed';
import { cn } from '../../../../shared/lib/utils';
import { Link } from 'react-router-dom';

export const AlertBell = () => {
  useAlertEvents(); // Inicia la conexión SSE
  const { unreadAlerts, removeUnreadAlert } = useAlertStore();
  const { mutate: markAsViewed } = useMarkAlertAsViewed();

  const handleMarkAsViewed = (id: string) => {
    markAsViewed(id, {
      onSuccess: () => {
        removeUnreadAlert(id);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground focus-visible:ring-0">
          <Bell className="w-5 h-5" />
          {unreadAlerts.length > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-card">
              {unreadAlerts.length > 99 ? '99+' : unreadAlerts.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl overflow-hidden border border-border shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 bg-muted border-b border-border">
          <h3 className="font-semibold text-foreground text-sm">Notificaciones</h3>
          <span className="text-xs text-muted-foreground font-medium">{unreadAlerts.length} nuevas</span>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {unreadAlerts.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground flex flex-col items-center">
              <Bell className="w-8 h-8 text-muted mb-2" />
              <p className="text-sm">No tienes notificaciones nuevas</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {unreadAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="p-4 border-b border-border hover:bg-muted/50 transition-colors relative group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col space-y-1">
                      <span className="text-[13px] text-foreground font-medium leading-snug">
                        {alert.message}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(alert.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarkAsViewed(alert.id)}
                    className="mt-2 text-xs text-emerald-600 font-medium hover:text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Marcar como leído
                  </button>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-2 bg-muted border-t border-border">
          <Link to="/alertas" className="block w-full py-2 text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors">
            Ver todo el historial
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
