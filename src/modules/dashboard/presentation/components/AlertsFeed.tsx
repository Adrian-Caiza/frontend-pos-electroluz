import { useAlertStore } from '../../../alert/presentation/store/useAlertStore';
import { useMarkAlertAsViewed } from '../../../alert/presentation/hooks/useMarkAlertAsViewed';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../shared/components/ui/card';
import { PackageSearch, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button';

export const AlertsFeed = () => {
  const unreadAlerts = useAlertStore((state) => state.unreadAlerts);
  const removeUnreadAlert = useAlertStore((state) => state.removeUnreadAlert);
  const { mutate: markAsViewed, isPending } = useMarkAlertAsViewed();

  const handleMarkAsViewed = (id: string) => {
    markAsViewed(id, {
      onSuccess: () => {
        removeUnreadAlert(id);
      }
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-border">
        <CardTitle className="text-lg font-semibold text-foreground">Centro de Alertas</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-y-auto max-h-[400px]">
        {unreadAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-3" />
            <p className="text-sm font-medium text-foreground">Todo está en orden</p>
            <p className="text-xs text-muted-foreground mt-1">No tienes alertas pendientes por revisar.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {unreadAlerts.map((alert) => (
              <li key={alert.id} className="p-4 hover:bg-muted transition-colors group">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    {alert.type === 'stock_bajo' ? (
                      <div className="p-1.5 bg-red-100 dark:bg-red-900/50 rounded-full">
                        <PackageSearch className="w-4 h-4 text-red-600" />
                      </div>
                    ) : (
                      <div className="p-1.5 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleMarkAsViewed(alert.id)}
                        className="h-6 px-2 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                      >
                        Marcar como visto
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
