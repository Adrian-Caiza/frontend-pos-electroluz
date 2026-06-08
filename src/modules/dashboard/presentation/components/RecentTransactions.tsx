import { useProformas } from '../../../proforma/presentation/hooks/useProformas';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../shared/components/ui/card';

export const RecentTransactions = () => {
  const { data, isLoading } = useProformas(1, 5);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'emitida':
        return 'bg-blue-100 text-blue-700';
      case 'pagada':
        return 'bg-emerald-100 text-emerald-700';
      case 'cancelada':
      case 'anulada':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">Últimas Transacciones</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.items?.map((item) => {
                  // In get-proformas-endpoint, the structure might be wrapped in `proforma` or directly spread.
                  // According to the types and our standard useProformas response mapping:
                  const prof = item.proforma || item;
                  return (
                    <tr key={prof.prfmaid} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                        {new Date(prof.prfmafchregistro).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {prof.receptor?.cliente?.clntenombre || prof.receptor?.clntenombre || 'Cliente General'}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        ${prof.total?.prfmatotal?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md ${getStatusBadgeClass(prof.prfmaestado)}`}>
                          {prof.prfmaestado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {(!data?.items || data.items.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No hay transacciones recientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
