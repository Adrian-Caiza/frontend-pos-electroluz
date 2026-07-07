import { useState, useEffect } from 'react';
import { Bell, PackageSearch, AlertTriangle, Check, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import { useAlertStore } from '../store/useAlertStore';
import { useAlertEvents } from '../hooks/useAlertEvents';
import { useMarkAlertAsViewed } from '../hooks/useMarkAlertAsViewed';
import { alertApi } from '../../infrastructure/services/alertApi';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '../../../../shared/components/ui/badge';

export const AlertBell = () => {
  useAlertEvents(); 
  
  const { unseenCount, bellAlerts, setBellAlerts, removeBellAlert, clearBellAlerts, decrementUnseen } = useAlertStore();
  const { mutate: markAsViewed } = useMarkAlertAsViewed();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      alertApi.getAlerts(1, 15, { visible: true, visto: false })
        .then((res) => {
          setBellAlerts(res.items);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, setBellAlerts]);

  const handleMarkAsViewed = (id: string) => {
    
    markAsViewed(id);
  };

  const handleMarkAllAsRead = () => {
    
    bellAlerts.forEach(alert => {
      markAsViewed(alert.id);
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative w-10 h-10 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-sm transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus-visible:ring-0"
        >
          <Bell className="w-5 h-5" />
          {unseenCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-card shadow-sm">
              {unseenCount > 99 ? '99+' : unseenCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[380px] p-0 rounded-2xl overflow-hidden border border-border shadow-xl bg-card">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-[15px]">Notificaciones</h3>
          </div>
          <div className="flex items-center gap-2">
            {unseenCount > 0 && (
              <Badge variant="secondary" className="px-2 py-0.5 text-[11px] font-medium bg-muted text-muted-foreground hover:bg-muted shadow-none">
                {unseenCount} nuevas
              </Badge>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full">
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[400px] overflow-y-auto p-3 space-y-2 bg-slate-50/50 dark:bg-slate-900/20">
          {isLoading && bellAlerts.length === 0 ? (
            <div className="py-12 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : bellAlerts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-foreground">Al día</p>
              <p className="text-xs mt-1">No tienes notificaciones pendientes.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {bellAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="group relative flex gap-3 p-3 rounded-xl border border-border bg-card shadow-sm hover:border-emerald-500/30 hover:shadow-md transition-all duration-200"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {alert.type === 'stock_bajo' ? (
                      <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center border border-red-100 dark:border-red-500/20">
                        <PackageSearch className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center border border-amber-100 dark:border-amber-500/20">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Body */}
                  <div className="flex flex-col flex-1 min-w-0 pb-1 pr-6">
                    <p className="text-[13px] text-foreground font-medium leading-relaxed">
                      {alert.message}
                    </p>
                    
                    {/* Tags */}
                    {(alert.branch?.name || alert.product?.code) && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {alert.branch?.name && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium bg-muted/50 border-border/50 rounded-md text-muted-foreground">
                            {alert.branch.name}
                          </Badge>
                        )}
                        {alert.product?.code && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium bg-muted/50 border-border/50 rounded-md text-muted-foreground">
                            SKU: {alert.product.code}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Time */}
                    <span className="text-[11px] text-muted-foreground font-medium mt-2">
                      {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true, locale: es })}
                    </span>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleMarkAsViewed(alert.id)}
                    className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 rounded-md opacity-0 group-hover:opacity-100 transition-all focus:outline-none focus:opacity-100"
                    title="Marcar como leído"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  
                  {/* Unread dot indicator */}
                  {!alert.isViewed && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 group-hover:hidden transition-all shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t border-border bg-card sticky bottom-0 z-10">
          <button 
            onClick={handleMarkAllAsRead}
            disabled={bellAlerts.length === 0}
            className="text-[13px] font-semibold text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors underline-offset-4 hover:underline focus-visible:outline-none"
          >
            Marcar todo como leído
          </button>
          <Link 
            to="/alertas" 
            className="px-4 py-1.5 text-[13px] font-semibold border border-border bg-card hover:bg-muted text-foreground dark:hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Ir al centro
          </Link>
        </div>

      </DropdownMenuContent>
    </DropdownMenu>
  );
};
