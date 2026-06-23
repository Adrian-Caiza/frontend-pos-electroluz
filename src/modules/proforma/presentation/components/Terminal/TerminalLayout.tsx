import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductSearch } from './ProductSearch';
import { CartPanel } from './CartPanel';
import { useProforma } from '../../hooks/useProforma';
import { useTerminalCart } from '../../hooks/useTerminalCart';
import { ConfirmDialog } from '../../../../../shared/components/ui/modal/ConfirmDialog';

export interface TerminalConfig {
  sucursalId: string | null;
  cajaId: string | null;
  clienteId: string | null;
  metodoPagoId: string | null;
}

export const TerminalLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { data: proforma, isLoading } = useProforma(editId);
  const { loadProforma, clearCart, items } = useTerminalCart();

  const [config, setConfig] = useState<TerminalConfig>({
    sucursalId: null,
    cajaId: null,
    clienteId: null,
    metodoPagoId: null,
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSucursalId, setPendingSucursalId] = useState<string | null>(null);

  useEffect(() => {
    if (proforma) {
      setConfig({
        sucursalId: proforma.emisor.sucursal.suid,
        cajaId: proforma.emisor.caja.cjid,
        clienteId: proforma.receptor.clnteid || (proforma.receptor as any).cliente?.clnteid,
        metodoPagoId: proforma.metodoPago.mpid,
      });
      loadProforma(proforma);
    }
  }, [proforma, loadProforma]);

  const handleChangeConfig = (key: keyof TerminalConfig, value: string | null) => {
    if (key === 'sucursalId' && config.sucursalId !== value && items.length > 0) {
      setPendingSucursalId(value);
      setShowConfirm(true);
    } else {
      setConfig(prev => {
        const next = { ...prev, [key]: value };
        if (key === 'sucursalId' && prev.sucursalId !== value) {
          next.cajaId = null; // Reset caja si cambia de sucursal
        }
        return next;
      });
    }
  };

  const handleSaleSuccess = () => {
    if (editId) {
      // Si estaba editando, limpiamos la url
      setSearchParams(new URLSearchParams());
      clearCart();
    }
    // We could redirect or just stay on the terminal for the next sale.
    // Resetting only the non-sticky config if desired. For now, keep config to make next sale faster.
  };

  if (isLoading && editId) {
    return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="space-y-4">
      {/* Grid Principal: Buscador y Carrito */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6 h-[calc(100dvh-5rem)] lg:h-[calc(100vh-8rem)]">
        
        <div className="lg:col-span-8 flex-1 flex flex-col min-h-0 gap-4 overflow-hidden">
          <ProductSearch 
            config={config} 
            onChangeConfig={handleChangeConfig} 
          />
        </div>

        <div className="lg:col-span-4 flex-1 flex flex-col min-h-0 gap-4">
          <CartPanel config={config} onSuccess={handleSaleSuccess} editId={editId} />
        </div>

      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setPendingSucursalId(null);
        }}
        onConfirm={() => {
          clearCart();
          setConfig(prev => ({ ...prev, sucursalId: pendingSucursalId, cajaId: null }));
          setShowConfirm(false);
          setPendingSucursalId(null);
        }}
        title="¿Cambiar de sucursal?"
        description="Esta acción vaciará los productos actuales del carrito ya que el inventario corresponde a la sucursal actual. ¿Deseas continuar?"
        confirmText="Sí, vaciar y cambiar"
        variant="warning"
      />
    </div>
  );
};
