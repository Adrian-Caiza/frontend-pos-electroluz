import { useState } from 'react';
import { MingcuteInventoryFill, FluentBoxMultipleArrowRight20Filled } from '../../shared/components/icons/icons';
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 dark:from-violet-500/10 dark:to-fuchsia-500/10 rounded-2xl border border-violet-500/20 shadow-sm flex items-center justify-center">
            <MingcuteInventoryFill className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
              Control de Existencias
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Supervisa el inventario general y repone stock cuando sea necesario
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FluentBoxMultipleArrowRight20Filled className="w-5 h-5 mr-2" />
          Ingresar Lote a Bodega
        </Button>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border shadow-sm flex items-center space-x-4">
        <Building2 className="w-5 h-5 text-muted-foreground" />
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground block mb-1">
            Filtrar Kardex por Sucursal
          </label>
          <select
            value={selectedSucursalId}
            onChange={(e) => setSelectedSucursalId(e.target.value)}
            className="flex h-10 w-full sm:max-w-md rounded-md border border-input bg-transparent dark:bg-slate-900 text-foreground px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">-- Seleccione una sucursal para ver su stock --</option>
            {sucursalesData?.items
              .filter(sucursal => sucursal.suestado === 'activo')
              .map((sucursal) => (
              <option key={sucursal.suid} value={sucursal.suid}>
                {sucursal.sunombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedSucursalId ? (
        <div className="w-full bg-transparent rounded-xl">
          <StockTable sucursalId={selectedSucursalId} />
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/50 rounded-lg border border-border border-dashed">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground">Selecciona una sucursal</h3>
          <p className="text-muted-foreground mt-1">
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
