import { useState, useEffect } from 'react';
import { Search, PackagePlus, Plus, Store, ShoppingCart, Users, WalletCards, UserPlus } from 'lucide-react';
import { useTerminalCart } from '../../hooks/useTerminalCart';
import { useStocks } from '../../../../stock/presentation/hooks/useStocks';
import { toast } from 'sonner';
import { useProductos } from '../../../../producto/presentation/hooks/useProductos';
import { Input } from '../../../../../shared/components/ui/input';
import { Button } from '../../../../../shared/components/ui/button';
import { ManualItemModal } from './ManualItemModal';
import { CreateClienteModal } from '../../../../cliente/presentation/components/CreateClienteModal';
import { useSucursales } from '../../../../sucursal/presentation/hooks/useSucursales';
import { useCheckouts } from '../../../../caja/presentation/hooks/useCheckouts';
import { useClientes } from '../../../../cliente/presentation/hooks/useClientes';
import { useMetodosPago } from '../../../../metodo-pago/presentation/hooks/useMetodosPago';
import type { TerminalConfig } from './TerminalLayout';
import { getImageUrl } from '../../../../producto/presentation/table/columns';

interface ProductSearchProps {
  config: TerminalConfig;
  onChangeConfig: (key: keyof TerminalConfig, value: string | null) => void;
}

export const ProductSearch = ({ config, onChangeConfig }: ProductSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { addItem, items: cartItems } = useTerminalCart();
  const [isClienteModalOpen, setClienteModalOpen] = useState(false);

  // Fetch lists for selectors
  const { data: sucursalesData } = useSucursales(1, 50);
  const { data: clientesData } = useClientes(1, 100);
  const { data: metodosData } = useMetodosPago(1, 50);
  const { data: cajasData } = useCheckouts(1, 100);

  const sucursales = sucursalesData?.items.filter(s => s.suestado === 'activo') || [];
  const clientes = clientesData?.items.filter(c => c.clnteestado === 'activo') || [];
  const metodos = metodosData?.items.filter(m => m.mpestado === 'activo') || [];
  const cajas = cajasData?.items.filter(c => c.cjestado === 'activo' && (!config.sucursalId || c.cjsuid === config.sucursalId)) || [];

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading } = useStocks(
    undefined,
    config.sucursalId || undefined,
    1,
    100
  );

  const { data: productosData } = useProductos(1, 1000);

  const filteredItems = data?.items.filter(stock => 
    stock.stckestado === 'activo' && (
      !debouncedSearch || 
      stock.producto.prdtonombre.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      stock.producto.prdtocodigo.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  ) || [];

  const handleAddProduct = (stock: any, productoData: any, availableStock: number) => {
    // Only add if there is stock available
    if (availableStock <= 0) {
      toast.error('No hay existencias disponibles para este producto en la sucursal seleccionada.');
      return;
    }

    addItem({
      id: stock.producto.prdtoid, // Use Product ID as unique local ID for inventariable items
      esInventariable: true,
      codigo: stock.producto.prdtocodigo,
      descripcion: stock.producto.prdtonombre,
      cantidad: 1, // Default add 1
      precioUnitario: productoData ? Number(productoData.prdtoprecioventa) : 0,
      stockMaximo: Number(stock.stckcantidad)
    });
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden min-h-0">
      
      {/* Settings Bar integrated directly */}
      <div className="p-3 border-b border-border bg-muted/30">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Sucursal */}
          <div className="relative">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              className="w-full h-10 pl-9 pr-8 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none shadow-sm transition-colors hover:border-border cursor-pointer"
              value={config.sucursalId || ''}
              onChange={(e) => {
                onChangeConfig('sucursalId', e.target.value || null);
                onChangeConfig('cajaId', null);
              }}
            >
              <option value="">Seleccionar Sucursal...</option>
              {sucursales.map(s => (
                <option key={s.suid} value={s.suid}>{s.sunombre}</option>
              ))}
            </select>
          </div>

          {/* Caja */}
          <div className="relative">
            <ShoppingCart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              className="w-full h-10 pl-9 pr-8 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none shadow-sm transition-colors hover:border-border cursor-pointer"
              value={config.cajaId || ''}
              onChange={(e) => onChangeConfig('cajaId', e.target.value || null)}
              disabled={!config.sucursalId}
            >
              <option value="">{config.sucursalId ? 'Caja Registradora...' : 'Esperando Sucursal...'}</option>
              {cajas.map(c => (
                <option key={c.cjid} value={c.cjid}>{c.cjidentificador}</option>
              ))}
            </select>
          </div>

          {/* Cliente */}
          <div className="relative flex items-center gap-1.5">
            <div className="relative flex-1">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                className="w-full h-10 pl-9 pr-8 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none shadow-sm transition-colors hover:border-border cursor-pointer"
                value={config.clienteId || ''}
                onChange={(e) => onChangeConfig('clienteId', e.target.value || null)}
              >
                <option value="">Cliente (Consumidor Final)...</option>
                {clientes.map(c => (
                  <option key={c.clnteid} value={c.clnteid}>{c.clntenombre}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => setClienteModalOpen(true)}
              className="h-10 px-3 flex items-center justify-center bg-background border border-border rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors shrink-0 shadow-sm"
              title="Nuevo Cliente"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>

          {/* Método de Pago */}
          <div className="relative">
            <WalletCards className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              className="w-full h-10 pl-9 pr-8 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none shadow-sm transition-colors hover:border-border cursor-pointer"
              value={config.metodoPagoId || ''}
              onChange={(e) => onChangeConfig('metodoPagoId', e.target.value || null)}
            >
              <option value="">Método de Pago...</option>
              {metodos.map(m => (
                <option key={m.mpid} value={m.mpid}>{m.mpnombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder={config.sucursalId ? "Buscar producto por código o nombre..." : "Selecciona una sucursal primero..."}
            className="pl-11 h-12 text-lg bg-background border-border focus-visible:ring-primary rounded-xl transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={!config.sucursalId}
          />
        </div>
        <ManualItemModal />
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {!config.sucursalId ? (
          <div className="h-full flex flex-col justify-center items-center text-muted-foreground p-6 text-center">
            <PackagePlus className="w-16 h-16 mb-4 text-muted/50" />
            <p className="text-base font-medium text-foreground">Sin sucursal seleccionada</p>
            <p className="text-sm mt-1">Por favor, selecciona una sucursal arriba para ver su inventario.</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-muted-foreground p-6 text-center">
            <p className="text-sm">No se encontraron productos en stock que coincidan con la búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItems.map((stock) => {
              const productoData = productosData?.items.find(p => p.prdtoid === stock.producto.prdtoid);
              const precio = productoData ? Number(productoData.prdtoprecioventa) : 0;
              const unidad = productoData?.medida?.mdiaabreviatura || 'UND';
              const imageUrl = getImageUrl(productoData?.prdtoimagen || null);
              
              const stockTotal = Number(stock.stckcantidad);
              const enCarrito = cartItems.find(i => i.id === stock.producto.prdtoid)?.cantidad || 0;
              const stockDisponible = stockTotal - enCarrito;

              return (
              <div 
                key={stock.stckid}
                onClick={stockDisponible > 0 ? () => handleAddProduct(stock, productoData, stockDisponible) : undefined}
                role="button"
                className={`flex flex-col bg-card rounded-2xl border transition-all group overflow-hidden ${stockDisponible > 0 ? 'border-border hover:border-primary/50 hover:shadow-md cursor-pointer active:scale-[0.98]' : 'border-border opacity-75 cursor-not-allowed'}`}
              >
                <div className="aspect-square bg-muted/30 relative overflow-hidden flex items-center justify-center p-4">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={stock.producto.prdtonombre} 
                      className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <PackagePlus className="w-12 h-12 text-muted-foreground/30" />
                  )}
                </div>
                
                <div className="p-3 flex flex-col flex-1 border-t border-border/50">
                  <div className="flex-1">
                    <div className="mb-1">
                      <span className="font-semibold text-foreground text-sm leading-tight line-clamp-2" title={stock.producto.prdtonombre}>
                        {stock.producto.prdtonombre}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                      {stock.producto.prdtocodigo}
                    </span>
                  </div>

                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="font-black text-indigo-700 text-lg leading-none">
                        ${precio.toFixed(2)}
                      </div>
                      <div className={`text-[10px] mt-1 font-semibold uppercase ${stockDisponible <= 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                        Stock: {stockDisponible} {unidad}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>

      <CreateClienteModal 
        open={isClienteModalOpen} 
        onOpenChange={setClienteModalOpen} 
      />
    </div>
  );
};
