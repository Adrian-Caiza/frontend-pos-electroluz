import { TeenyiconsCreditCardSolid } from '../../shared/components/icons/icons';
import { MetodoPagoTable } from '../../modules/metodo-pago/presentation/components/MetodoPagoTable';
import { CreateMetodoPagoModal } from '../../modules/metodo-pago/presentation/components/CreateMetodoPagoModal';

export default function MetodosPagoPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-pink-500/20 to-rose-500/20 dark:from-pink-500/10 dark:to-rose-500/10 rounded-2xl border border-pink-500/20 shadow-sm flex items-center justify-center">
            <TeenyiconsCreditCardSolid className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
              Métodos de Pago
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Configura las formas de pago aceptadas en el Terminal POS.
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <CreateMetodoPagoModal />
        </div>
      </div>

      <div className="w-full bg-transparent rounded-xl">
        <MetodoPagoTable />
      </div>
    </div>
  );
}
