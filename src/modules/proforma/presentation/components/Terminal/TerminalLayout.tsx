import { useState } from 'react';
import { ConfigPanel } from './ConfigPanel';
import type { TerminalConfig } from './ConfigPanel';
import { ProductSearch } from './ProductSearch';
import { CartPanel } from './CartPanel';
import { ManualItemModal } from './ManualItemModal';

export const TerminalLayout = () => {
  const [config, setConfig] = useState<TerminalConfig>({
    sucursalId: null,
    cajaId: null,
    clienteId: null,
    metodoPagoId: null,
  });

  const handleChangeConfig = (key: keyof TerminalConfig, value: string | null) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSaleSuccess = () => {
    // We could redirect or just stay on the terminal for the next sale.
    // Resetting only the non-sticky config if desired. For now, keep config to make next sale faster.
  };

  return (
    <div className="space-y-4">
      {/* 1. Panel Superior: Configuración de la Venta */}
      <ConfigPanel config={config} onChange={handleChangeConfig} />

      {/* 2. Grid Principal: Buscador y Carrito */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Catálogo / Búsqueda</h2>
            <ManualItemModal />
          </div>
          <ProductSearch selectedSucursalId={config.sucursalId} />
        </div>

        <div className="lg:col-span-5 flex flex-col space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Caja / Facturación</h2>
          <CartPanel config={config} onSuccess={handleSaleSuccess} />
        </div>

      </div>
    </div>
  );
};
