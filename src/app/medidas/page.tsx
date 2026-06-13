import { Scale } from 'lucide-react';
import { MedidaTable } from '../../modules/medida/presentation/components/MedidaTable';
import { CreateMedidaModal } from '../../modules/medida/presentation/components/CreateMedidaModal';

export default function MedidasPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <Scale className="w-6 h-6 mr-2 text-primary" />
            Gestión de Medidas
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Administra las unidades de medida de tus productos
          </p>
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
