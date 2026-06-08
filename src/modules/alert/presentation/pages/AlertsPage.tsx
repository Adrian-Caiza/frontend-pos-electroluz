import { AlertTable } from '../components/AlertTable';

export const AlertsPage = () => {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Historial de Alertas</h1>
          <p className="text-sm text-slate-500 mt-1">
            Registro de todas las notificaciones y eventos importantes del sistema.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
        <AlertTable />
      </div>
    </div>
  );
};
