import { useState } from 'react';
import { MingcuteInventoryFill, FluentBoxMultipleArrowRight20Filled, SolarBuildings2Bold } from '../../shared/components/icons/icons';
import { Building2, MapPin, ChevronDown, Package } from 'lucide-react';
import { Button } from '../../shared/components/ui/button';
import { StockTable } from '../../modules/stock/presentation/components/StockTable';
import { CreateStockModal } from '../../modules/stock/presentation/components/CreateStockModal';
import { useSucursales } from '../../modules/sucursal/presentation/hooks/useSucursales';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../shared/components/ui/select';

export const StockPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSucursalId, setSelectedSucursalId] = useState<string>('');

  // Traemos sucursales para el filtro
  const { data: sucursalesData } = useSucursales(1, 100);

  const activeSucursales = sucursalesData?.items.filter(s => s.suestado === 'activo') || [];
  const selectedSucursal = activeSucursales.find(s => s.suid === selectedSucursalId);

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

      {/* Sucursal Selector - Premium Card */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Accent gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500" />
        
        <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon + Label */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 dark:from-violet-500/10 dark:to-fuchsia-500/10 border border-violet-500/10 shrink-0">
              <SolarBuildings2Bold className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Filtrar Kardex por Sucursal</p>
              <p className="text-xs text-muted-foreground mt-0.5">Selecciona el punto de venta para consultar su inventario</p>
            </div>
          </div>

          {/* Select */}
          <div className="w-full sm:w-auto sm:ml-auto">
            <Select value={selectedSucursalId} onValueChange={setSelectedSucursalId}>
              <SelectTrigger className="w-full sm:w-[320px] h-11 bg-background dark:bg-slate-900/60 border-border shadow-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="Seleccionar sucursal..." />
                </div>
              </SelectTrigger>
              <SelectContent>
                {activeSucursales.map((sucursal) => (
                  <SelectItem key={sucursal.suid} value={sucursal.suid}>
                    {sucursal.sunombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selected sucursal indicator */}
        {selectedSucursal && (
          <div className="border-t border-border/60 px-5 py-2.5 bg-violet-500/5 dark:bg-violet-500/[0.03] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">
              Mostrando inventario de <span className="text-foreground font-semibold">{selectedSucursal.sunombre}</span>
            </span>
          </div>
        )}
      </div>

      {selectedSucursalId ? (
        <div className="w-full bg-transparent rounded-xl">
          <StockTable sucursalId={selectedSucursalId} />
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl border border-dashed border-border bg-muted/30">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 dark:from-violet-500/10 dark:to-fuchsia-500/10 border border-violet-500/10 mb-4">
            <Package className="w-7 h-7 text-violet-500/70 dark:text-violet-400/70" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Selecciona una sucursal</h3>
          <p className="text-muted-foreground mt-1.5 text-sm max-w-md mx-auto">
            Para monitorear el inventario y kardex de productos, elige una sucursal en el selector de arriba.
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
