import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductSearch } from './ProductSearch';
import { CartPanel } from './CartPanel';
import { useProforma } from '../../hooks/useProforma';
import { useTerminalCart } from '../../hooks/useTerminalCart';

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
  const { loadProforma, clearCart } = useTerminalCart();

  const [config, setConfig] = useState<TerminalConfig>({
    sucursalId: null,
    cajaId: null,
    clienteId: null,
    metodoPagoId: null,
  });

  useEffect(() => {
    if (proforma) {
      setConfig({
        sucursalId: proforma.emisor.sucursal.suid,
        cajaId: proforma.emisor.caja.cjid,
        clienteId: proforma.receptor.clnteid,
        metodoPagoId: proforma.metodoPago.mpid,
      });
      loadProforma(proforma);
    }
  }, [proforma, loadProforma]);

  const handleChangeConfig = (key: keyof TerminalConfig, value: string | null) => {
    setConfig(prev => ({ ...prev, [key]: value }));
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
        
        <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden">
          <ProductSearch 
            config={config} 
            onChangeConfig={handleChangeConfig} 
          />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <CartPanel config={config} onSuccess={handleSaleSuccess} editId={editId} />
        </div>

      </div>
    </div>
  );
};
