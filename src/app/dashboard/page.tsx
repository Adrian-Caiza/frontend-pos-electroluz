import { DashboardHeader } from '../../modules/dashboard/presentation/components/DashboardHeader';
import { DashboardKpis } from '../../modules/dashboard/presentation/components/DashboardKpis';
import { RecentTransactions } from '../../modules/dashboard/presentation/components/RecentTransactions';
import { AlertsFeed } from '../../modules/dashboard/presentation/components/AlertsFeed';

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Cabecera */}
      <DashboardHeader />

      {/* Fila Superior: KPIs */}
      <DashboardKpis />

      {/* Grid Inferior: Transacciones y Alertas */}
      <div className="grid gap-6 md:grid-cols-12 flex-1">
        
        {/* Panel Izquierdo: Últimas Transacciones (60%) */}
        <div className="md:col-span-12 lg:col-span-8">
          <RecentTransactions />
        </div>

        {/* Panel Derecho: Centro de Alertas (40%) */}
        <div className="md:col-span-12 lg:col-span-4">
          <AlertsFeed />
        </div>
      </div>
    </div>
  );
}
