import { DashboardHeader } from '../../modules/dashboard/presentation/components/DashboardHeader';
import { DashboardKpis } from '../../modules/dashboard/presentation/components/DashboardKpis';
import { RecentTransactions } from '../../modules/dashboard/presentation/components/RecentTransactions';
import { AlertsFeed } from '../../modules/dashboard/presentation/components/AlertsFeed';
import { SalesTrendChart } from '../../modules/dashboard/presentation/components/charts/SalesTrendChart';
import { TopProductsChart } from '../../modules/dashboard/presentation/components/charts/TopProductsChart';
import { ProformaStatusChart } from '../../modules/dashboard/presentation/components/charts/ProformaStatusChart';
import { SalesCompositionChart } from '../../modules/dashboard/presentation/components/charts/SalesCompositionChart';
import { useDashboardStats } from '../../modules/dashboard/presentation/hooks/useDashboardStats';

export default function DashboardPage() {
  const { 
    isLoading, 
    salesTrendData, 
    topProductsData, 
    proformaStatusData, 
    categoryCompositionData 
  } = useDashboardStats();

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Cabecera */}
      <DashboardHeader />

      {/* Fila Superior: KPIs */}
      <DashboardKpis />

      {/* Fila: Tendencia de Ventas (Ancho Completo) */}
      <div className="w-full">
        <SalesTrendChart data={salesTrendData} isLoading={isLoading} />
      </div>

      {/* Fila: Gráficos de Composición y Ranking */}
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-6 lg:col-span-4">
          <TopProductsChart data={topProductsData} isLoading={isLoading} />
        </div>
        <div className="md:col-span-6 lg:col-span-4">
          <SalesCompositionChart data={categoryCompositionData} isLoading={isLoading} />
        </div>
        <div className="md:col-span-12 lg:col-span-4">
          <ProformaStatusChart data={proformaStatusData} isLoading={isLoading} />
        </div>
      </div>

      {/* Grid Inferior: Transacciones y Alertas */}
      <div className="grid gap-6 md:grid-cols-12 flex-1">
        <div className="md:col-span-12 lg:col-span-8">
          <RecentTransactions />
        </div>
        <div className="md:col-span-12 lg:col-span-4">
          <AlertsFeed />
        </div>
      </div>
    </div>
  );
}
