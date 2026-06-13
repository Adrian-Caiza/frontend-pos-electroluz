import { Truck } from 'lucide-react';
import { ProveedorTable } from '../../modules/proveedor/presentation/components/ProveedorTable';
import { CreateProveedorModal } from '../../modules/proveedor/presentation/components/CreateProveedorModal';

export default function ProveedoresPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <Truck className="w-6 h-6 mr-2 text-primary" />
            Gestión de Proveedores
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Administra los proveedores de tu negocio
          </p>
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
