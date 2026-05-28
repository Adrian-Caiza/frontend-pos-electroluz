import { ShoppingCart, Trash2, Minus, Plus, RefreshCw, Send } from 'lucide-react';
import { useTerminalCart } from '../../hooks/useTerminalCart';
import { useCreateProforma } from '../../hooks/useCreateProforma';
import type { TerminalConfig } from './ConfigPanel';
import { Button } from '../../../../../shared/components/ui/button';
import { Input } from '../../../../../shared/components/ui/input';

interface CartPanelProps {
  config: TerminalConfig;
  onSuccess: () => void;
}

export const CartPanel = ({ config, onSuccess }: CartPanelProps) => {
  const cart = useTerminalCart();
  const { mutateAsync: createProforma, isPending } = useCreateProforma();

  const handleProcessSale = async () => {
    if (!config.sucursalId || !config.cajaId || !config.clienteId || !config.metodoPagoId) {
      alert('Por favor complete todos los parámetros de venta en el panel superior.');
      return;
    }

    if (cart.items.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    try {
      await createProforma({
        prfmasuid: config.sucursalId,
        prfmacjid: config.cajaId,
        prfmaclnteid: config.clienteId,
        prfmampid: config.metodoPagoId,
        prfmasubtotal: cart.subtotal,
        prfmadescuento: cart.descuento,
        prfmatotal: cart.total,
        dprfmaproductos: cart.items.map(item => ({
          dprfmaesinventariable: item.esInventariable,
          dprfmacodigo: item.codigo,
          dprfmadescripcion: item.descripcion,
          dprfmacantidad: item.cantidad,
          dprfmapreciounitario: item.precioUnitario,
          dprfmapreciototal: item.precioTotal,
        }))
      });
      
      alert('¡Venta procesada con éxito!');
      cart.clearCart();
      onSuccess();
    } catch (error: any) {
      alert('Ocurrió un error al procesar la venta. Verifique los datos.');
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2 text-indigo-500" />
          Carrito de Compras
        </h3>
        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
          {cart.items.length} ítems
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {cart.items.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-slate-400 p-6 text-center">
            <ShoppingCart className="w-12 h-12 mb-3 text-slate-200" />
            <p className="text-sm">El carrito está vacío. Agrega productos o servicios manuales.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {cart.items.map(item => (
              <div 
                key={item.id}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-slate-900 text-sm line-clamp-1">
                      {item.descripcion}
                    </span>
                    {!item.esInventariable && (
                      <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-100 px-1 rounded">Manual</span>
                    )}
                  </div>
                  <button 
                    onClick={() => cart.removeItem(item.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => cart.updateQuantity(item.id, item.cantidad - 1)}
                      className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.cantidad}</span>
                    <button 
                      onClick={() => cart.updateQuantity(item.id, item.cantidad + 1)}
                      className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">${item.precioUnitario.toFixed(2)} c/u</div>
                    <div className="font-bold text-slate-900">${item.precioTotal.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Descuento</span>
            <div className="flex items-center">
              <span className="mr-1">-$</span>
              <Input 
                type="number" 
                className="w-20 h-7 text-right px-2 py-1 text-xs" 
                value={cart.descuento || ''}
                onChange={(e) => cart.setDescuento(Number(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
            <span>Total a Pagar</span>
            <span className="text-indigo-700">${cart.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="text-slate-600"
            onClick={() => {
              if (window.confirm('¿Vaciar todo el carrito?')) cart.clearCart();
            }}
            disabled={cart.items.length === 0 || isPending}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleProcessSale}
            disabled={cart.items.length === 0 || isPending}
          >
            {isPending ? 'Procesando...' : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Cobrar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
