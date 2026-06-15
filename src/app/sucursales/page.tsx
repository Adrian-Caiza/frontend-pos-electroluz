import { SucursalTable } from '../../modules/sucursal/presentation/components/SucursalTable';
import { CreateSucursalModal } from '../../modules/sucursal/presentation/components/CreateSucursalModal';
import { useAuthStore } from '../../shared/stores/useAuthStore';
import { SolarBuildings2Bold } from '../../shared/components/icons/icons';

export default function SucursalesPage() {
  const { user } = useAuthStore();
  const isJefe = user?.usrol === 'jefe';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 dark:from-amber-500/10 dark:to-yellow-500/10 rounded-2xl border border-amber-500/20 shadow-sm flex items-center justify-center">
            <SolarBuildings2Bold className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
              Gestión de Sucursales
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Administra las sucursales físicas de tu empresa
            </p>
          </div>
        </div>
        {isJefe && (
          <div className="flex-shrink-0">
            <CreateSucursalModal />
          </div>
        )}
      </div>

      <div className="w-full bg-transparent rounded-xl">
        <SucursalTable />
      </div>
    </div>
  );
}
