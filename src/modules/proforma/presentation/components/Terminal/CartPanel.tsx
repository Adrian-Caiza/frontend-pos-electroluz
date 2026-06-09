import { ShoppingCart, Trash2, Minus, Plus, RefreshCw, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTerminalCart } from '../../hooks/useTerminalCart';
import { useCreateProforma } from '../../hooks/useCreateProforma';
import { useUpdateProforma } from '../../hooks/useUpdateProforma';
import type { TerminalConfig } from './TerminalLayout';
import { Button } from '../../../../../shared/components/ui/button';
import { Input } from '../../../../../shared/components/ui/input';
import { ConfirmDialog } from '../../../../../shared/components/ui/modal/ConfirmDialog';

interface CartPanelProps {
  config: TerminalConfig;
  onSuccess: () => void;
  editId?: string | null;
}

export const CartPanel = ({ config, onSuccess, editId }: CartPanelProps) => {
  const cart = useTerminalCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { mutate: createProforma, isPending: isCreating } = useCreateProforma();
  const { mutate: updateProforma, isPending: isUpdating } = useUpdateProforma();
  const isPending = isCreating || isUpdating;

  const handleProcessSale = async () => {
    if (!config.sucursalId || !config.cajaId || !config.clienteId || !config.metodoPagoId) {
      toast.warning('Por favor complete todos los parámetros de venta en el panel superior.');
      return;
    }

    if (cart.items.length === 0) {
      toast.warning('El carrito está vacío.');
      return;
    }

    const itemsPayload = cart.items.map(item => ({
      dprfmaid: item.dprfmaid,
      dprfmaesinventariable: item.esInventariable,
      dprfmacodigo: item.codigo,
      dprfmadescripcion: item.descripcion,
      dprfmacantidad: item.cantidad,
      dprfmapreciounitario: item.precioUnitario,
      dprfmapreciototal: item.precioTotal,
    }));

    const handleMutateSuccess = () => {
      toast.success(editId ? '¡Proforma actualizada con éxito!' : '¡Proforma generada con éxito!');
      cart.clearCart();
      onSuccess();
    };

    const handleMutateError = (error: any) => {
      const backendError = error.response?.data?.message || error.response?.data?.error || error.message || 'Error desconocido';
      toast.error(`Ocurrió un error al procesar la operación. Detalle: ${backendError}`);
    };

    if (editId) {
      updateProforma({
        id: editId,
        data: {
          prfmaclnteid: config.clienteId,
          prfmampid: config.metodoPagoId,
          prfmasubtotal: cart.subtotal,
          prfmadescuento: cart.descuento,
          prfmatotal: cart.total,
          dprfmaproductos: itemsPayload
        }
      }, {
        onSuccess: handleMutateSuccess,
        onError: handleMutateError
      });
    } else {
      createProforma({
        prfmasuid: config.sucursalId,
        prfmacjid: config.cajaId,
        prfmaclnteid: config.clienteId,
        prfmampid: config.metodoPagoId,
        prfmasubtotal: cart.subtotal,
        prfmadescuento: cart.descuento,
        prfmatotal: cart.total,
        dprfmaproductos: itemsPayload
      }, {
        onSuccess: handleMutateSuccess,
        onError: handleMutateError
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden min-h-0">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-slate-800 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-indigo-500" />
            Carrito de Compras
            <span className="ml-3 bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {cart.items.length}
            </span>
          </h3>
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            disabled={cart.items.length === 0 || isPending}
            className="text-slate-400 hover:text-rose-500 transition-colors disabled:opacity-50"
            title="Limpiar Carrito"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 bg-slate-50/50">
          {cart.items.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-slate-400 p-6 text-center">
              <ShoppingCart className="w-16 h-16 mb-4 text-slate-200" />
              <p className="text-sm font-medium">Ticket Vacío</p>
              <p className="text-xs mt-1">Agrega productos o servicios para continuar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.items.map(item => (
                <div 
                  key={item.id}
                  className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col relative group"
                >
                  <div className="flex justify-between items-start pr-6 mb-2">
                    <div>
                      <span className="font-medium text-slate-900 text-[14px] leading-snug block">
                        {item.descripcion}
                      </span>
                      <span className="text-[11.5px] text-slate-500 mt-0.5 block">
                        {!item.esInventariable ? 'Servicio Manual' : `Cód: ${item.codigo}`}
                      </span>
                    </div>
                    <button 
                      onClick={() => cart.removeItem(item.id)}
                      className="absolute right-2 top-2 p-1.5 text-slate-300 hover:text-rose-500 transition-colors opacity-0 md:opacity-100 md:group-hover:opacity-100 rounded-md hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="w-full h-px bg-slate-50 my-1" />
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center bg-slate-50/80 rounded-[10px] border border-slate-100 p-0.5 shadow-sm">
                      <button 
                        onClick={() => cart.updateQuantity(item.id, item.cantidad - 1)}
                        className="w-7 h-7 rounded-[8px] bg-white border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[13px] font-semibold w-8 text-center text-slate-700">{item.cantidad}</span>
                      <button 
                        onClick={() => cart.updateQuantity(item.id, item.cantidad + 1)}
                        disabled={item.stockMaximo !== undefined && item.cantidad >= item.stockMaximo}
                        className="w-7 h-7 rounded-[8px] bg-white border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 font-medium leading-none mb-1">${item.precioUnitario.toFixed(2)} c/u</div>
                      <div className="font-black text-slate-900 text-[15px] leading-none">${item.precioTotal.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 bg-white rounded-b-2xl shrink-0 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)] relative z-10">
          <div className="border-t-2 border-dashed border-slate-200 mb-4 absolute top-0 left-4 right-4" />
          
          <div className="space-y-3 mb-5 mt-2">
            <div className="flex justify-between text-slate-500 text-sm font-medium">
              <span>Subtotal</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 text-sm font-medium">
              <span>Descuento</span>
              <div className="flex items-center">
                <span className="mr-1 text-slate-400">-$</span>
                <Input 
                  type="number" 
                  className="w-24 h-8 text-right px-2 py-1 text-sm bg-slate-50 border-slate-200 font-semibold text-rose-500 focus-visible:ring-rose-200" 
                  value={cart.descuento || ''}
                  onChange={(e) => cart.setDescuento(Number(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-end pt-3">
              <span className="text-slate-500 font-medium pb-1">Total a Pagar</span>
              <span className="text-4xl font-black text-slate-900 tracking-tight">
                ${cart.total.toFixed(2)}
              </span>
            </div>
          </div>

          <Button 
            className="w-full h-16 text-lg font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
            onClick={handleProcessSale}
            disabled={cart.items.length === 0 || isPending}
          >
            {isPending ? 'Procesando...' : (
              <>
                <Send className="w-5 h-5 mr-3" />
                {editId ? 'Guardar Cambios' : 'Generar Proforma'}
              </>
            )}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          cart.clearCart();
          setShowClearConfirm(false);
        }}
        title="¿Vaciar todo el ticket?"
        description="Se eliminarán todos los productos agregados. Esta acción no se puede deshacer."
        confirmText="Sí, vaciar"
        variant="destructive"
      />
    </>
  );
};
