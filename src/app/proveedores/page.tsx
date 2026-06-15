import { FluentVehicleTruckCube24Filled } from '../../shared/components/icons/icons';
import { ProveedorTable } from '../../modules/proveedor/presentation/components/ProveedorTable';
import { CreateProveedorModal } from '../../modules/proveedor/presentation/components/CreateProveedorModal';

export default function ProveedoresPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-orange-500/20 to-amber-500/20 dark:from-orange-500/10 dark:to-amber-500/10 rounded-2xl border border-orange-500/20 shadow-sm flex items-center justify-center">
            <FluentVehicleTruckCube24Filled className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
              Gestión de Proveedores
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Administra los proveedores de tu negocio
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <CreateProveedorModal />
        </div>
      </div>
      
      <div className="w-full bg-transparent rounded-xl">
        <ProveedorTable />
      </div>
    </div>
  );
}
