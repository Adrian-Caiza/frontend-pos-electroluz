import { useProformas } from '../../../proforma/presentation/hooks/useProformas';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../shared/components/ui/card';

export const RecentTransactions = () => {
  const { data, isLoading } = useProformas(1, 5);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'emitida':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
      case 'pagada':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300';
      case 'cancelada':
      case 'anulada':
        return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-muted text-muted-foreground dark:text-foreground';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Últimas Transacciones</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.items?.map((item) => {
                  // In get-proformas-endpoint, the structure might be wrapped in `proforma` or directly spread.
                  // According to the types and our standard useProformas response mapping:
                  const prof = item.proforma || item;
                  return (
                    <tr key={prof.prfmaid} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {new Date(prof.prfmafchregistro).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {prof.receptor?.cliente?.clntenombre || prof.receptor?.clntenombre || 'Cliente General'}
                      </td>
                      <td className="px-4 py-3 font-bold text-foreground">
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
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
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
