import { FaSolidFileInvoiceDollar } from '../../shared/components/icons/icons';
import { ProformaTable } from '../../modules/proforma/presentation/components/Auditoria/ProformaTable';

export default function ProformasPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-2xl border border-blue-500/20 shadow-sm flex items-center justify-center">
            <FaSolidFileInvoiceDollar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
              Historial de Ventas
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Audita las proformas emitidas, procesa pagos o cancela órdenes.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-transparent rounded-xl">
        <ProformaTable />
      </div>
    </div>
  );
}
