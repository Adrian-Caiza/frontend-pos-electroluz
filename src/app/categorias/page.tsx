import { FolderTree } from 'lucide-react';
import { CreateCategoriaModal } from '../../modules/categoria/presentation/components/CreateCategoriaModal';
import { CategoriaTable } from '../../modules/categoria/presentation/components/CategoriaTable';

import { useAuthStore } from '../../shared/stores/useAuthStore';

export default function CategoriasPage() {
  const { user } = useAuthStore();
  const isAuthorized = user?.usrol === 'jefe' || user?.usrol === 'empleado';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <FolderTree className="w-6 h-6 mr-2 text-primary" />
            Gestión de Categorías
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Administra las categorías de tus productos
          </p>
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
