import { WalletCards } from 'lucide-react';
import { MetodoPagoTable } from '../../modules/metodo-pago/presentation/components/MetodoPagoTable';
import { CreateMetodoPagoModal } from '../../modules/metodo-pago/presentation/components/CreateMetodoPagoModal';

export default function MetodosPagoPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <WalletCards className="w-6 h-6 mr-2 text-indigo-600" />
            Métodos de Pago
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Configura las formas de pago aceptadas en el Terminal POS.
          </p>
        </div>
        <div className="flex-shrink-0">
          <CreateMetodoPagoModal />
        </div>
      </div>

      <div className="w-full bg-white rounded-xl">
        <MetodoPagoTable />
      </div>
    </div>
  );
}
