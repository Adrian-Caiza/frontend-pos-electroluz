import { Card } from '../../../../shared/components/ui/card';
import { useProformas } from '../../../proforma/presentation/hooks/useProformas';
import { useProductos } from '../../../producto/presentation/hooks/useProductos';
import { useClientes } from '../../../cliente/presentation/hooks/useClientes';
import { useAlertStore } from '../../../alert/presentation/store/useAlertStore';
import { Loader2, DollarSign, Package, Users, BellRing, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../../../shared/lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  caption: string;
  icon: React.ElementType;
  iconBgColor: string;
  loading?: boolean;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  containerClassName?: string;
}

const KpiCard = ({ title, value, caption, icon: Icon, iconBgColor, loading, trend, trendValue, containerClassName }: KpiCardProps) => {
  return (
    <Card className={cn("p-5 flex flex-col justify-between border-border shadow-sm transition-all duration-300 hover:shadow-md", containerClassName)}>
      <div className="flex items-start gap-4 mb-3">
        <div className={cn("w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0 text-white shadow-sm", iconBgColor)}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex flex-col mt-0.5">
          <span className="text-[13px] font-medium text-muted-foreground mb-1 tracking-wide">{title}</span>
          <div className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{value}</span>
            )}
            {!loading && trend && (
              <div className={cn(
                "flex items-center justify-center p-0.5 rounded-full",
                trend === 'up' ? "text-emerald-500" : trend === 'down' ? "text-orange-500" : "text-slate-400"
              )}>
                {trend === 'up' && <TrendingUp className="w-5 h-5" strokeWidth={2.5} />}
                {trend === 'down' && <TrendingDown className="w-5 h-5" strokeWidth={2.5} />}
                {trend === 'neutral' && <Minus className="w-5 h-5" strokeWidth={2.5} />}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-[13px] text-muted-foreground font-medium">
          {trendValue && <span className={cn(
            "font-semibold mr-1",
            trend === 'up' ? "text-emerald-600 dark:text-emerald-400" : trend === 'down' ? "text-orange-600 dark:text-orange-400" : "text-slate-500"
          )}>{trendValue}</span>}
          {caption}
        </span>
      </div>
    </Card>
  );
};

export const DashboardKpis = () => {
  const { data: proformasData, isLoading: loadingProformas } = useProformas(1, 1);
  const { data: productosData, isLoading: loadingProductos } = useProductos(1, 10000);
  const { data: clientesData, isLoading: loadingClientes } = useClientes(1, 1000);
  
  const activeProductosCount = productosData?.items?.filter(p => p.prdtoestado !== 'eliminado').length || 0;
  const activeClientesCount = clientesData?.items?.filter(c => c.clnteestado !== 'eliminado').length || 0;
  
  const unreadAlertsCount = useAlertStore((state) => state.unreadAlerts.length);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        title="Ventas Totales"
        value={proformasData?.totalItems || 0}
        caption="Incremento respecto al mes anterior"
        icon={DollarSign}
        iconBgColor="bg-[#A17E45] dark:bg-[#B89252]"
        loading={loadingProformas}
        trend="up"
        trendValue="+12%"
      />

      <KpiCard
        title="Catálogo"
        value={activeProductosCount}
        caption="Actualización del inventario"
        icon={Package}
        iconBgColor="bg-[#2B5A8F] dark:bg-[#3B70AD]"
        loading={loadingProductos}
        trend="down"
        trendValue="-2%"
      />

      <KpiCard
        title="Cartera de Clientes"
        value={activeClientesCount}
        caption="Nuevos registros este mes"
        icon={Users}
        iconBgColor="bg-[#8E44AD] dark:bg-[#9B59B6]"
        loading={loadingClientes}
        trend="up"
        trendValue="+5%"
      />

      <KpiCard
        title="Alertas Pendientes"
        value={unreadAlertsCount}
        caption={unreadAlertsCount > 0 ? "Requieren tu atención" : "Todo está al día"}
        icon={BellRing}
        iconBgColor={unreadAlertsCount > 0 ? "bg-red-600 dark:bg-red-500" : "bg-[#4834D4] dark:bg-[#686DE0]"}
        trend={unreadAlertsCount > 0 ? "up" : "neutral"}
        containerClassName={unreadAlertsCount > 0 ? "border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10" : ""}
      />
    </div>
  );
};
