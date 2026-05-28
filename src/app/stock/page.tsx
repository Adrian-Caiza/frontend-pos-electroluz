import { useState } from 'react';
import { PackagePlus, Building2 } from 'lucide-react';
import { Button } from '../../shared/components/ui/button';
import { StockTable } from '../../modules/stock/presentation/components/StockTable';
import { CreateStockModal } from '../../modules/stock/presentation/components/CreateStockModal';
import { useSucursales } from '../../modules/sucursal/presentation/hooks/useSucursales';

export const StockPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSucursalId, setSelectedSucursalId] = useState<string>('');

  // Traemos sucursales para el filtro
  const { data: sucursalesData } = useSucursales(1, 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Control de Existencias</h1>
          <p className="text-slate-500 mt-1">
            Administra el inventario y stock físico de cada sucursal
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <PackagePlus className="w-4 h-4 mr-2" />
          Ingresar Lote a Bodega
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center space-x-4">
        <Building2 className="w-5 h-5 text-slate-400" />
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-700 block mb-1">
            Filtrar Kardex por Sucursal
          </label>
          <select
            value={selectedSucursalId}
            onChange={(e) => setSelectedSucursalId(e.target.value)}
            className="flex h-10 w-full sm:max-w-md rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          >
            <option value="">-- Seleccione una sucursal para ver su stock --</option>
            {sucursalesData?.items.map((sucursal) => (
              <option key={sucursal.suid} value={sucursal.suid}>
                {sucursal.sunombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedSucursalId ? (
        <StockTable sucursalId={selectedSucursalId} />
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900">Selecciona una sucursal</h3>
          <p className="text-slate-500 mt-1">
            Para monitorear el inventario debes elegir una sucursal en el selector de arriba.
          </p>
        </div>
      )}

      <CreateStockModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        defaultSucursalId={selectedSucursalId}
      />
    </div>
  );
};
