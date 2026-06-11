import { FileText } from 'lucide-react';
import { ProformaTable } from '../../modules/proforma/presentation/components/Auditoria/ProformaTable';

export default function ProformasPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <FileText className="w-6 h-6 mr-2 text-primary" />
            Historial de Ventas
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Audita las proformas emitidas, procesa pagos o cancela órdenes.
          </p>
        </div>
      </div>

      <div className="w-full bg-transparent rounded-xl">
        <ProformaTable />
      </div>
    </div>
  );
}
