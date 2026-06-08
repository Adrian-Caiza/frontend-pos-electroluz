import { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import { useMarkAlertAsViewed } from '../hooks/useMarkAlertAsViewed';
import { useAlertStore } from '../store/useAlertStore';
import type { Alert } from '../../domain/entities/Alert';
import { PackageSearch, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../../shared/lib/utils';
import { Button } from '../../../../shared/components/ui/button';

export const AlertsPage = () => {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const { data, isLoading } = useAlerts(page, pageSize);
  const { mutate: markAsViewed } = useMarkAlertAsViewed();
  const { removeUnreadAlert } = useAlertStore();

  const handleMarkAsViewed = (id: string) => {
    markAsViewed(id, {
      onSuccess: () => {
        removeUnreadAlert(id);
      }
    });
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Historial de Alertas</h1>
          <p className="text-sm text-slate-500 mt-1">
            Registro de todas las notificaciones y eventos importantes del sistema.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50/50">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Detalle de la Alerta</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sucursal</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fecha y Hora</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                      Cargando historial de alertas...
                    </div>
                  </td>
                </tr>
              ) : data?.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      </div>
                      <p className="text-base font-medium text-slate-700">No hay alertas registradas</p>
                      <p className="text-sm mt-1">El sistema está operando con normalidad.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.items.map((alert: Alert) => (
                  <tr key={alert.alid} className={cn("group transition-colors", !alert.alvisto ? "bg-red-50/30 hover:bg-red-50/60" : "hover:bg-slate-50/50")}>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                        {alert.altipo === 'stock_bajo' ? (
                          <PackageSearch className={cn("w-4 h-4", !alert.alvisto ? "text-red-500" : "text-slate-400")} />
                        ) : (
                          <AlertTriangle className={cn("w-4 h-4", !alert.alvisto ? "text-red-500" : "text-slate-400")} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col max-w-md">
                        <span className={cn("text-sm", !alert.alvisto ? "font-semibold text-slate-900" : "font-medium text-slate-700")}>
                          {alert.almensaje}
                        </span>
                        {alert.altipo === 'stock_bajo' && alert.alcantidadactual !== undefined && (
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                              Actual: {alert.alcantidadactual}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700">
                              Mínimo: {alert.alstockminimo}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-600">
                        {alert.branch?.sunombre || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-600">
                        {alert.product?.prdtonombre || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(alert.alfchcreacion).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!alert.alvisto && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsViewed(alert.alid)}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        >
                          Marcar visto
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {data && data.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200/60 bg-slate-50 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Página {data.page} de {data.totalPages}
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="h-8 rounded-lg"
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
