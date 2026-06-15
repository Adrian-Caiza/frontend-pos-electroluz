import { ProductoTable } from '../../modules/producto/presentation/components/ProductoTable';
import { CreateProductoModal } from '../../modules/producto/presentation/components/CreateProductoModal';
import { ProductDetailPanel } from '../../modules/producto/presentation/components/ProductDetailPanel';
import { useAuthStore } from '../../shared/stores/useAuthStore';
import { IxProductCatalog } from '../../shared/components/icons/icons';

export default function ProductosPage() {
  const { user } = useAuthStore();
  const isAuthorized = user?.usrol === 'jefe' || user?.usrol === 'empleado';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-2xl border border-emerald-500/20 shadow-sm flex items-center justify-center">
            <IxProductCatalog className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
              Catálogo de Productos
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Gestiona los productos, precios y niveles de stock
            </p>
          </div>
        </div>
        {isAuthorized && (
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
