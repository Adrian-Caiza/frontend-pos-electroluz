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
    <div className="flex flex-col lg:flex-row items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200 shrink-0">
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-slate-100 shrink-0">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span className="text-xs font-bold text-slate-700 tracking-wide">TERMINAL</span>
      </div>

      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-2 w-full">
        {/* Sucursal */}
        <div className="relative">
          <Store className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            className="w-full h-9 pl-8 pr-8 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none shadow-sm"
            value={config.sucursalId || ''}
            onChange={(e) => {
              onChange('sucursalId', e.target.value || null);
              onChange('cajaId', null);
            }}
          >
            <option value="">Seleccionar Sucursal...</option>
            {sucursales.map(s => (
              <option key={s.suid} value={s.suid}>{s.sunombre}</option>
            ))}
          </select>
        </div>

        {/* Caja */}
        <div className="relative">
          <ShoppingCart className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            className="w-full h-9 pl-8 pr-8 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none shadow-sm"
            value={config.cajaId || ''}
            onChange={(e) => onChange('cajaId', e.target.value || null)}
            disabled={!config.sucursalId}
          >
            <option value="">{config.sucursalId ? 'Caja Registradora...' : 'Esperando Sucursal...'}</option>
            {cajas.map(c => (
              <option key={c.cjid} value={c.cjid}>{c.cjidentificador}</option>
            ))}
          </select>
        </div>

        {/* Cliente */}
        <div className="relative flex items-center gap-1">
          <div className="relative flex-1">
            <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              className="w-full h-9 pl-8 pr-8 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none shadow-sm"
              value={config.clienteId || ''}
              onChange={(e) => onChange('clienteId', e.target.value || null)}
            >
              <option value="">Cliente (Consumidor Final)...</option>
              {clientes.map(c => (
                <option key={c.clnteid} value={c.clnteid}>{c.clntenombre}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setClienteModalOpen(true)}
            className="h-9 px-2.5 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors shrink-0 shadow-sm"
            title="Nuevo Cliente"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>

        {/* Método de Pago */}
        <div className="relative">
          <WalletCards className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            className="w-full h-9 pl-8 pr-8 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none shadow-sm"
            value={config.metodoPagoId || ''}
            onChange={(e) => onChange('metodoPagoId', e.target.value || null)}
          >
            <option value="">Método de Pago...</option>
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
