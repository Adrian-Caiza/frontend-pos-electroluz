import { CheckoutTable } from '../../modules/caja/presentation/components/CheckoutTable';
import { CreateCheckoutModal } from '../../modules/caja/presentation/components/CreateCheckoutModal';
import { useAuthStore } from '../../shared/stores/useAuthStore';
import { FaSolidCashRegister } from '../../shared/components/icons/icons';

export default function CajaPage() {
  const { user } = useAuthStore();
  const isJefe = user?.usrol === 'jefe';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10 rounded-2xl border border-green-500/20 shadow-sm flex items-center justify-center">
            <FaSolidCashRegister className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
              Gestión de Cajas
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Administra las cajas registradoras de tus sucursales
            </p>
          </div>
        </div>
        {isJefe && (
          <div className="flex-shrink-0">
            <CreateCheckoutModal />
          </div>
        )}
      </div>

      <div className="w-full bg-transparent rounded-xl">
        <CheckoutTable />
      </div>
    </div>
  );
}
