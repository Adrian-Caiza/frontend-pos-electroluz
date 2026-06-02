import { SucursalTable } from '../../modules/sucursal/presentation/components/SucursalTable';
import { CreateSucursalModal } from '../../modules/sucursal/presentation/components/CreateSucursalModal';
import { useAuthStore } from '../../shared/stores/useAuthStore';
import { Building2 } from 'lucide-react';

export default function SucursalesPage() {
  const { user } = useAuthStore();
  const isJefe = user?.usrol === 'jefe';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-indigo-600" />
            Gestión de Sucursales
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Administra las sucursales físicas de tu empresa
          </p>
        </div>
        {isJefe && (
          <div className="flex-shrink-0">
            <CreateSucursalModal />
          </div>
        )}
      </div>

      <div className="w-full bg-white rounded-xl">
        <SucursalTable />
      </div>
    </div>
  );
}
