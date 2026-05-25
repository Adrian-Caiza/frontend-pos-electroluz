import { CheckoutTable } from '../../modules/caja/presentation/components/CheckoutTable';
import { CreateCheckoutModal } from '../../modules/caja/presentation/components/CreateCheckoutModal';
import { useAuthStore } from '../../shared/stores/useAuthStore';
import { Store } from 'lucide-react';

export default function CajaPage() {
  const { user } = useAuthStore();
  const isJefe = user?.usrol === 'jefe';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Store className="w-6 h-6 mr-2 text-indigo-600" />
            Gestión de Cajas
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Administra las cajas registradoras de tus sucursales
          </p>
        </div>
        {isJefe && (
          <div className="flex-shrink-0">
            <CreateCheckoutModal />
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-1">
          <CheckoutTable />
        </div>
      </div>
    </div>
  );
}
