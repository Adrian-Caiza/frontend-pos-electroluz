import { GisTags } from '../../shared/components/icons/icons';
import { MarcaTable } from '../../modules/marca/presentation/components/MarcaTable';
import { CreateMarcaModal } from '../../modules/marca/presentation/components/CreateMarcaModal';
import { useAuthStore } from '../../shared/stores/useAuthStore';

export default function MarcasPage() {
  const { user } = useAuthStore();
  const isAuthorized = user?.usrol === 'jefe' || user?.usrol === 'empleado';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-sky-500/10 dark:to-blue-500/10 rounded-2xl border border-sky-500/20 shadow-sm flex items-center justify-center">
            <GisTags className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
              Gestión de Marcas
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Administra las marcas de tus productos
            </p>
          </div>
        </div>
        {isAuthorized && (
          <div className="flex-shrink-0">
            <CreateMarcaModal />
          </div>
        )}
      </div>
      
      <div className="w-full bg-transparent rounded-xl">
        <MarcaTable />
      </div>
    </div>
  );
}
