import { useState, useEffect } from 'react';
import { Search, PackagePlus, Plus } from 'lucide-react';
import { useTerminalCart } from '../../hooks/useTerminalCart';
import { useStocks } from '../../../../stock/presentation/hooks/useStocks';
import { toast } from 'sonner';
import { useProductos } from '../../../../producto/presentation/hooks/useProductos';
import { Input } from '../../../../../shared/components/ui/input';
import { Button } from '../../../../../shared/components/ui/button';
import { ManualItemModal } from './ManualItemModal';

interface ProductSearchProps {
  selectedSucursalId: string | null;
}

export const ProductSearch = ({ selectedSucursalId }: ProductSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const addItem = useTerminalCart(state => state.addItem);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading } = useStocks(
    undefined,
    selectedSucursalId || undefined,
    1,
    100
  );

  const { data: productosData } = useProductos(1, 1000);

  const filteredItems = data?.items.filter(stock => 
    !debouncedSearch || 
    stock.producto.prdtonombre.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    stock.producto.prdtocodigo.toLowerCase().includes(debouncedSearch.toLowerCase())
  ) || [];

  const handleAddProduct = (stock: any, productoData: any) => {
    // Only add if there is stock available
    const stockActual = Number(stock.stckcantidad);
    if (stockActual <= 0) {
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
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder={selectedSucursalId ? "Buscar producto por código o nombre..." : "Selecciona una sucursal primero..."}
            className="pl-11 h-12 text-lg bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={!selectedSucursalId}
          />
        </div>
        <ManualItemModal />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {!selectedSucursalId ? (
          <div className="h-full flex flex-col justify-center items-center text-slate-400 p-6 text-center">
            <PackagePlus className="w-12 h-12 mb-3 text-slate-200" />
            <p className="text-sm">Por favor, selecciona una sucursal en el panel de configuración para ver su inventario.</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-slate-400 p-6 text-center">
            <p className="text-sm">No se encontraron productos en stock que coincidan con la búsqueda.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((stock) => {
              const productoData = productosData?.items.find(p => p.prdtoid === stock.producto.prdtoid);
              const precio = productoData ? Number(productoData.prdtoprecioventa) : 0;
              const unidad = productoData?.medida.mdiaabreviatura || 'UND';

              return (
              <div 
                key={stock.stckid}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors group"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-medium text-slate-900 truncate">
                      {stock.producto.prdtonombre}
                    </span>
                    <span className="font-bold text-indigo-700 ml-2">
                      ${precio.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded mr-2">
                      {stock.producto.prdtocodigo}
                    </span>
                    <span className={Number(stock.stckcantidad) <= 0 ? 'text-rose-500 font-medium' : ''}>
                      Stock: {stock.stckcantidad} {unidad}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={Number(stock.stckcantidad) > 0 ? "default" : "secondary"}
                  disabled={Number(stock.stckcantidad) <= 0}
                  className={Number(stock.stckcantidad) > 0 ? "bg-indigo-600 hover:bg-indigo-700 shrink-0" : "shrink-0"}
                  onClick={() => handleAddProduct(stock, productoData)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
};
