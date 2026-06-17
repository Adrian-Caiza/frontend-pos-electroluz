import { useState, useEffect, useMemo } from 'react';
import { Search, PackagePlus, Plus, UserPlus, Hash, User, Mail, Phone } from 'lucide-react';
import { SolarBuildings2Bold, FaSolidCashRegister, FluentPeopleTeam20Filled, TeenyiconsCreditCardSolid, FluentPersonEdit20Filled, IcRoundPersonAddAlt1 } from '../../../../../shared/components/icons/icons';
import { useTerminalCart } from '../../hooks/useTerminalCart';
import { useStocks } from '../../../../stock/presentation/hooks/useStocks';
import { toast } from 'sonner';
import { useProductos } from '../../../../producto/presentation/hooks/useProductos';
import { Input } from '../../../../../shared/components/ui/input';
import { Button } from '../../../../../shared/components/ui/button';
import { ManualItemModal } from './ManualItemModal';
import { CreateClienteModal } from '../../../../cliente/presentation/components/CreateClienteModal';
import { EditClienteModal } from '../../../../cliente/presentation/components/EditClienteModal';
import { useSucursales } from '../../../../sucursal/presentation/hooks/useSucursales';
import { useCheckouts } from '../../../../caja/presentation/hooks/useCheckouts';
import { useClientes } from '../../../../cliente/presentation/hooks/useClientes';
import { useMetodosPago } from '../../../../metodo-pago/presentation/hooks/useMetodosPago';
import type { TerminalConfig } from './TerminalLayout';
import { getImageUrl } from '../../../../../shared/utils/getImageUrl';
import { SearchableSelect } from '../../../../../shared/components/ui/SearchableSelect';

interface ProductSearchProps {
  config: TerminalConfig;
  onChangeConfig: (key: keyof TerminalConfig, value: string | null) => void;
}

export const ProductSearch = ({ config, onChangeConfig }: ProductSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { addItem, items: cartItems } = useTerminalCart();
  const [isClienteModalOpen, setClienteModalOpen] = useState(false);
  const [isEditClienteModalOpen, setEditClienteModalOpen] = useState(false);

  // Fetch lists for selectors
  const { data: sucursalesData } = useSucursales(1, 50);
  const { data: clientesData } = useClientes(1, 100);
  const { data: metodosData } = useMetodosPago(1, 50);
  const { data: cajasData } = useCheckouts(1, 100);

  const sucursales = sucursalesData?.items.filter(s => s.suestado === 'activo') || [];
  const clientes = clientesData?.items.filter(c => c.clnteestado === 'activo') || [];
  const metodos = metodosData?.items.filter(m => m.mpestado === 'activo') || [];
  const cajas = cajasData?.items.filter(c => c.cjestado === 'activo' && (!config.sucursalId || c.cjsuid === config.sucursalId)) || [];

  // Build SearchableSelect options
  const sucursalOptions = useMemo(() =>
    sucursales.map(s => ({ id: s.suid, label: s.sunombre })),
    [sucursales]
  );

  const cajaOptions = useMemo(() =>
    cajas.map(c => ({ id: c.cjid, label: c.cjidentificador })),
    [cajas]
  );

  const clienteOptions = useMemo(() =>
    clientes.map(c => ({
      id: c.clnteid,
      label: c.clntenombre,
      sublabel: `${c.clntetipoidentificacion === 'ruc' ? 'RUC' : 'CI'}: ${c.clnteidentificacion}`,
    })),
    [clientes]
  );

  const metodoOptions = useMemo(() =>
    metodos.map(m => ({ id: m.mpid, label: m.mpnombre })),
    [metodos]
  );

  // Selected client data for info card
  const selectedCliente = useMemo(() =>
    clientes.find(c => c.clnteid === config.clienteId) || null,
    [clientes, config.clienteId]
  );

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
      
      {/* Settings Bar with SearchableSelects */}
      <div className="p-4 border-b border-border bg-muted/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
          {/* Sucursal */}
          <SearchableSelect
            icon={SolarBuildings2Bold}
            placeholder="Buscar sucursal..."
            options={sucursalOptions}
            value={config.sucursalId}
            onChange={(val) => {
              onChangeConfig('sucursalId', val);
              onChangeConfig('cajaId', null);
            }}
            emptyMessage="No se encontraron sucursales"
          />

          {/* Caja */}
          <SearchableSelect
            icon={FaSolidCashRegister}
            placeholder={config.sucursalId ? 'Buscar caja...' : 'Esperando sucursal...'}
            options={cajaOptions}
            value={config.cajaId}
            onChange={(val) => onChangeConfig('cajaId', val)}
            disabled={!config.sucursalId}
            emptyMessage="No hay cajas para esta sucursal"
          />

          {/* Cliente */}
          <div className="flex items-center gap-1.5">
            <div className="flex-1 min-w-0">
              <SearchableSelect
                icon={FluentPeopleTeam20Filled}
                placeholder="Buscar cliente..."
                options={clienteOptions}
                value={config.clienteId}
                onChange={(val) => onChangeConfig('clienteId', val)}
                emptyMessage="No se encontraron clientes"
              />
            </div>
            <button
              type="button"
              onClick={() => setClienteModalOpen(true)}
              className="h-10 w-10 flex items-center justify-center bg-background border border-border rounded-lg text-primary hover:bg-primary/10 transition-colors shrink-0 shadow-sm"
              title="Nuevo Cliente"
            >
              <IcRoundPersonAddAlt1 className="w-5 h-5" />
            </button>
          </div>

          {/* Método de Pago */}
          <SearchableSelect
            icon={TeenyiconsCreditCardSolid}
            placeholder="Buscar método de pago..."
            options={metodoOptions}
            value={config.metodoPagoId}
            onChange={(val) => onChangeConfig('metodoPagoId', val)}
            emptyMessage="No se encontraron métodos"
          />
        </div>

        {/* Client Info Card — appears when a client is selected */}
        {selectedCliente && (
          <div className="mt-3 animate-in fade-in-0 slide-in-from-top-2 duration-300">
            <div className="relative bg-background/60 border border-border rounded-xl p-3 pl-4 border-l-4 border-l-primary overflow-hidden">
              {/* Subtle gradient background accent */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative flex items-center gap-6 flex-wrap">
                {/* Avatar / Icon */}
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>

                {/* Cedula */}
                <div className="flex items-center gap-2 min-w-0">
                  <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold leading-none mb-0.5">
                      {selectedCliente.clntetipoidentificacion === 'ruc' ? 'RUC' : 'Cédula'}
                    </div>
                    <div className="text-sm font-semibold text-foreground leading-none">
                      {selectedCliente.clnteidentificacion}
                    </div>
                  </div>
                </div>

                {/* Separador visual */}
                <div className="hidden sm:block w-px h-8 bg-border" />

                {/* Nombre */}
                <div className="flex items-center gap-2 min-w-0">
                  <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold leading-none mb-0.5">
                      Nombre
                    </div>
                    <div className="text-sm font-semibold text-foreground leading-none truncate max-w-[200px]">
                      {selectedCliente.clntenombre}
                    </div>
                  </div>
                </div>

                {/* Separador visual */}
                <div className="hidden sm:block w-px h-8 bg-border" />

                {/* Correo */}
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold leading-none mb-0.5">
                      Correo
                    </div>
                    <div className="text-sm text-foreground leading-none truncate max-w-[200px]">
                      {selectedCliente.clntecorreo}
                    </div>
                  </div>
                </div>

                {/* Separador visual */}
                <div className="hidden sm:block w-px h-8 bg-border" />

                {/* Teléfono */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold leading-none mb-0.5">
                      Teléfono
                    </div>
                    <div className="text-sm text-foreground leading-none">
                      {selectedCliente.clntetelefono}
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => setEditClienteModalOpen(true)}
                  className="flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors shrink-0 ml-auto"
                  title="Editar Cliente"
                >
                  <FluentPersonEdit20Filled className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
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

      <EditClienteModal
        open={isEditClienteModalOpen}
        onOpenChange={setEditClienteModalOpen}
        cliente={selectedCliente}
      />
    </div>
  );
};
