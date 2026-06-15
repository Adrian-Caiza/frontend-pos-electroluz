import { StreamlineUltimatePackageDimensionBold } from '../../shared/components/icons/icons';
import { MedidaTable } from '../../modules/medida/presentation/components/MedidaTable';
import { CreateMedidaModal } from '../../modules/medida/presentation/components/CreateMedidaModal';

export default function MedidasPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 dark:from-purple-500/10 dark:to-indigo-500/10 rounded-2xl border border-purple-500/20 shadow-sm flex items-center justify-center">
            <StreamlineUltimatePackageDimensionBold className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
              Gestión de Medidas
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Administra las unidades de medida de tus productos
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <CreateMedidaModal />
        </div>
      </div>
      
      <div className="w-full bg-transparent rounded-xl">
        <MedidaTable />
      </div>
    </div>
  );
}
