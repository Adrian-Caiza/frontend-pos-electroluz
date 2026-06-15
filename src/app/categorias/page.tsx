import { MdiFileTree } from '../../shared/components/icons/icons';
import { CreateCategoriaModal } from '../../modules/categoria/presentation/components/CreateCategoriaModal';
import { CategoriaTable } from '../../modules/categoria/presentation/components/CategoriaTable';

import { useAuthStore } from '../../shared/stores/useAuthStore';

export default function CategoriasPage() {
  const { user } = useAuthStore();
  const isAuthorized = user?.usrol === 'jefe' || user?.usrol === 'empleado';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-slate-500/20 to-gray-500/20 dark:from-slate-500/10 dark:to-gray-500/10 rounded-2xl border border-slate-500/20 shadow-sm flex items-center justify-center">
            <MdiFileTree className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
              Gestión de Categorías
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Administra las categorías de tus productos
            </p>
          </div>
        </div>
        {isAuthorized && (
          <div className="flex-shrink-0">
            <CreateCategoriaModal />
          </div>
        )}
      </div>
      
      <div className="w-full bg-transparent rounded-xl">
        <CategoriaTable />
      </div>
    </div>
  );
}
