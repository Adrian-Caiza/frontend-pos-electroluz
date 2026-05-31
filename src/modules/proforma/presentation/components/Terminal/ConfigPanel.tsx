import { Store, ShoppingCart, Users, WalletCards, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useSucursales } from '../../../../sucursal/presentation/hooks/useSucursales';
import { useCheckouts } from '../../../../caja/presentation/hooks/useCheckouts';
import { useClientes } from '../../../../cliente/presentation/hooks/useClientes';
import { useMetodosPago } from '../../../../metodo-pago/presentation/hooks/useMetodosPago';
import { CreateClienteModal } from '../../../../cliente/presentation/components/CreateClienteModal';

export interface TerminalConfig {
  sucursalId: string | null;
  cajaId: string | null;
  clienteId: string | null;
  metodoPagoId: string | null;
}

interface ConfigPanelProps {
  config: TerminalConfig;
  onChange: (key: keyof TerminalConfig, value: string | null) => void;
}

export const ConfigPanel = ({ config, onChange }: ConfigPanelProps) => {
  const [isClienteModalOpen, setClienteModalOpen] = useState(false);
  // Fetch lists for selectors
  const { data: sucursalesData, isLoading: loadingSucursales } = useSucursales(1, 50);
  const { data: clientesData, isLoading: loadingClientes } = useClientes(1, 100);
  const { data: metodosData, isLoading: loadingMetodos } = useMetodosPago(1, 50);
  // Cajas depend on selected Sucursal
  const { data: cajasData, isLoading: loadingCajas } = useCheckouts(1, 100);

  const sucursales = sucursalesData?.items.filter(s => s.suestado === 'activo') || [];
  const clientes = clientesData?.items.filter(c => c.clnteestado === 'activo') || [];
  const metodos = metodosData?.items.filter(m => m.mpestado === 'activo') || [];
  // For cajas, we must also filter by active if needed, but standard is fine
  const cajas = cajasData?.items.filter(c => c.cjestado === 'activo' && (!config.sucursalId || c.cjsuid === config.sucursalId)) || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
      <h2 className="font-semibold text-slate-800 mb-4 flex items-center">
        Parámetros de Venta
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sucursal */}
        <div>
          <label className="text-sm font-medium text-slate-700 flex items-center mb-1.5">
            <Store className="w-4 h-4 mr-1.5 text-indigo-500" />
            Sucursal
          </label>
          <select
            className="flex h-10 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-colors"
            value={config.sucursalId || ''}
            onChange={(e) => {
              onChange('sucursalId', e.target.value || null);
              // Reset caja when sucursal changes
              onChange('cajaId', null);
            }}
          >
            <option value="">Seleccione Sucursal...</option>
            {sucursales.map(s => (
              <option key={s.suid} value={s.suid}>{s.sunombre}</option>
            ))}
          </select>
        </div>

        {/* Caja */}
        <div>
          <label className="text-sm font-medium text-slate-700 flex items-center mb-1.5">
            <ShoppingCart className="w-4 h-4 mr-1.5 text-indigo-500" />
            Caja Registradora
          </label>
          <select
            className="flex h-10 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-colors"
            value={config.cajaId || ''}
            onChange={(e) => onChange('cajaId', e.target.value || null)}
            disabled={!config.sucursalId}
          >
            <option value="">{config.sucursalId ? 'Seleccione Caja...' : 'Esperando Sucursal...'}</option>
            {cajas.map(c => (
              <option key={c.cjid} value={c.cjid}>{c.cjidentificador}</option>
            ))}
          </select>
        </div>

        {/* Cliente */}
        <div>
          <label className="text-sm font-medium text-slate-700 flex items-center justify-between mb-1.5">
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1.5 text-indigo-500" />
              Cliente
            </span>
            <button
              type="button"
              onClick={() => setClienteModalOpen(true)}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold transition-colors"
            >
              <UserPlus className="w-3 h-3" />
              Nuevo
            </button>
          </label>
          <select
            className="flex h-10 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-colors"
            value={config.clienteId || ''}
            onChange={(e) => onChange('clienteId', e.target.value || null)}
          >
            <option value="">Seleccione Cliente (Consumidor Final)...</option>
            {clientes.map(c => (
              <option key={c.clnteid} value={c.clnteid}>{c.clntenombre} - {c.clnteidentificacion}</option>
            ))}
          </select>
        </div>

        {/* Método de Pago */}
        <div>
          <label className="text-sm font-medium text-slate-700 flex items-center mb-1.5">
            <WalletCards className="w-4 h-4 mr-1.5 text-indigo-500" />
            Método de Pago
          </label>
          <select
            className="flex h-10 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-colors"
            value={config.metodoPagoId || ''}
            onChange={(e) => onChange('metodoPagoId', e.target.value || null)}
          >
            <option value="">Seleccione Método...</option>
            {metodos.map(m => (
              <option key={m.mpid} value={m.mpid}>{m.mpnombre}</option>
            ))}
          </select>
        </div>
      </div>

      <CreateClienteModal 
        open={isClienteModalOpen} 
        onOpenChange={setClienteModalOpen} 
      />
    </div>
  );
};
