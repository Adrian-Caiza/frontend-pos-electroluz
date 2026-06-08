import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { useProformas } from '../../../proforma/presentation/hooks/useProformas';
import { useProductos } from '../../../producto/presentation/hooks/useProductos';
import { useClientes } from '../../../cliente/presentation/hooks/useClientes';
import { useAlertStore } from '../../../alert/presentation/store/useAlertStore';
import { Loader2, DollarSign, Package, Users, BellRing } from 'lucide-react';
import { cn } from '../../../../shared/lib/utils';

export const DashboardKpis = () => {
  // For Productos and Clientes, we need to fetch all and filter out "eliminado" 
  // since the backend doesn't filter them and tables do local filtering.
  // Using the same parameters as their respective tables to leverage React Query cache.
  const { data: proformasData, isLoading: loadingProformas } = useProformas(1, 1);
  const { data: productosData, isLoading: loadingProductos } = useProductos(1, 10000);
  const { data: clientesData, isLoading: loadingClientes } = useClientes(1, 1000);
  
  const activeProductosCount = productosData?.items?.filter(p => p.prdtoestado !== 'eliminado').length || 0;
  const activeClientesCount = clientesData?.items?.filter(c => c.clnteestado !== 'eliminado').length || 0;
  
  // Real-time unread alerts from store
  const unreadAlertsCount = useAlertStore((state) => state.unreadAlerts.length);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Ventas Totales</CardTitle>
          <DollarSign className="w-4 h-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          {loadingProformas ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          ) : (
            <div className="text-2xl font-bold text-slate-900">{proformasData?.totalItems || 0}</div>
          )}
          <p className="text-xs text-slate-500 mt-1">Proformas emitidas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Catálogo</CardTitle>
          <Package className="w-4 h-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          {loadingProductos ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          ) : (
            <div className="text-2xl font-bold text-slate-900">{activeProductosCount}</div>
          )}
          <p className="text-xs text-slate-500 mt-1">Productos registrados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Cartera de Clientes</CardTitle>
          <Users className="w-4 h-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          {loadingClientes ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          ) : (
            <div className="text-2xl font-bold text-slate-900">{activeClientesCount}</div>
          )}
          <p className="text-xs text-slate-500 mt-1">Clientes activos</p>
        </CardContent>
      </Card>

      <Card className={cn(unreadAlertsCount > 0 && "border-red-200 bg-red-50/30")}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className={cn("text-sm font-medium", unreadAlertsCount > 0 ? "text-red-700" : "text-slate-600")}>
            Alertas Pendientes
          </CardTitle>
          <BellRing className={cn("w-4 h-4", unreadAlertsCount > 0 ? "text-red-500" : "text-slate-400")} />
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", unreadAlertsCount > 0 ? "text-red-600" : "text-slate-900")}>
            {unreadAlertsCount}
          </div>
          <p className={cn("text-xs mt-1", unreadAlertsCount > 0 ? "text-red-500/80" : "text-slate-500")}>
            Notificaciones no leídas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
