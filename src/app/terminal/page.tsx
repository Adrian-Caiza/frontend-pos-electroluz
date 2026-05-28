import { MonitorPlay } from 'lucide-react';
import { TerminalLayout } from '../../modules/proforma/presentation/components/Terminal/TerminalLayout';

export default function TerminalPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <MonitorPlay className="w-6 h-6 mr-2 text-indigo-600" />
            Terminal POS
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Punto de Venta. Configura los parámetros y registra los ítems a facturar.
          </p>
        </div>
      </div>

      <TerminalLayout />
    </div>
  );
}
