import { ProductoTable } from '../../modules/producto/presentation/components/ProductoTable';
import { CreateProductoModal } from '../../modules/producto/presentation/components/CreateProductoModal';
import { ProductDetailPanel } from '../../modules/producto/presentation/components/ProductDetailPanel';
import { useAuthStore } from '../../shared/stores/useAuthStore';
import { PackageSearch } from 'lucide-react';

export default function ProductosPage() {
  const { user } = useAuthStore();
  const isJefe = user?.usrol === 'jefe';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <PackageSearch className="w-6 h-6 mr-2 text-primary" />
            Catálogo de Productos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gestiona los productos, precios y niveles de stock
          </p>
        </div>
        {isJefe && (
          <div className="flex-shrink-0">
            <CreateProductoModal />
          </div>
        )}
      </div>

      <div className="w-full bg-transparent rounded-xl">
        <ProductoTable />
      </div>

      <ProductDetailPanel />
    </div>
  );
}
