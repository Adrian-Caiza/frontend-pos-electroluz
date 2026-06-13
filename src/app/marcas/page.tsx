import { Tag } from 'lucide-react';
import { MarcaTable } from '../../modules/marca/presentation/components/MarcaTable';

export default function MarcasPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <Tag className="w-6 h-6 mr-2 text-primary" />
            Gestión de Marcas
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Administra las marcas de tus productos
          </p>
        </div>
      </div>
      
      <div className="w-full bg-transparent rounded-xl">
        <MarcaTable />
      </div>
    </div>
  );
}
