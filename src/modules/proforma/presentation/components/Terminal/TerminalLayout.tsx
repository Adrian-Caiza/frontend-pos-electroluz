import { useState } from 'react';
import { ConfigPanel } from './ConfigPanel';
import type { TerminalConfig } from './ConfigPanel';
import { ProductSearch } from './ProductSearch';
import { CartPanel } from './CartPanel';


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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
        
        <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden">
          <ProductSearch selectedSucursalId={config.sucursalId} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <CartPanel config={config} onSuccess={handleSaleSuccess} />
        </div>

      </div>
    </div>
  );
};
