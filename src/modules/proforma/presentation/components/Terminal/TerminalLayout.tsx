import { useState } from 'react';
import { ProductSearch } from './ProductSearch';
import { CartPanel } from './CartPanel';

export interface TerminalConfig {
  sucursalId: string | null;
  cajaId: string | null;
  clienteId: string | null;
  metodoPagoId: string | null;
}

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
      {/* Grid Principal: Buscador y Carrito */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
        
        <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden">
          <ProductSearch 
            config={config} 
            onChangeConfig={handleChangeConfig} 
          />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <CartPanel config={config} onSuccess={handleSaleSuccess} />
        </div>

      </div>
    </div>
  );
};
