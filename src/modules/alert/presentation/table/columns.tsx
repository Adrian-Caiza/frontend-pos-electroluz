import type { ColumnDef } from '@tanstack/react-table';
import type { Alert } from '../../domain/entities/Alert';
import { PackageSearch, AlertTriangle } from 'lucide-react';
import { cn } from '../../../../shared/lib/utils';
import { Button } from '../../../../shared/components/ui/button';

export interface AlertTableMeta {
  onMarkAsViewed: (id: string) => void;
}

export const columns: ColumnDef<Alert>[] = [
  {
    id: 'icon',
    header: 'Tipo',
    cell: ({ row }) => {
      const alert = row.original;
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
          {alert.altipo === 'stock_bajo' ? (
            <PackageSearch className={cn("w-4 h-4", !alert.alvisto ? "text-red-500" : "text-slate-400")} />
          ) : (
            <AlertTriangle className={cn("w-4 h-4", !alert.alvisto ? "text-red-500" : "text-slate-400")} />
          )}
        </div>
      );
    },
    enableSorting: false,
    size: 60,
  },
  {
    id: 'mensaje',
    header: 'Mensaje',
    cell: ({ row }) => {
      const alert = row.original;
      
      let displayMessage = alert.almensaje;
      if (alert.altipo === 'stock_bajo') {
        displayMessage = 'Nivel de inventario crítico';
      }

      return (
        <div className="flex flex-col min-w-[180px]">
          <span className={cn("text-[13px]", !alert.alvisto ? "font-bold text-slate-900" : "font-medium text-slate-700")}>
            {displayMessage}
          </span>
          {alert.altipo === 'stock_bajo' && alert.alcantidadactual !== undefined && (
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                Actual: {alert.alcantidadactual}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Mínimo: {alert.alstockminimo}
              </span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: 'sucursal',
    header: 'Sucursal',
    cell: ({ row }) => {
      return <span className="text-sm font-medium text-slate-600">{row.original.branch?.sunombre || 'N/A'}</span>;
    },
  },
  {
    id: 'producto',
    header: 'Producto',
    cell: ({ row }) => {
      return <span className="text-sm font-medium text-slate-600">{row.original.product?.prdtonombre || 'N/A'}</span>;
    },
  },
  {
    accessorKey: 'alfchcreacion',
    header: 'Fecha y Hora',
    cell: ({ row }) => {
      return <span className="whitespace-nowrap text-sm text-slate-500">{new Date(row.original.alfchcreacion).toLocaleString()}</span>;
    },
  },
  {
    id: 'actions',
    header: '',
    size: 100,
    cell: ({ row, table }) => {
      const alert = row.original;
      const meta = table.options.meta as AlertTableMeta;
      
      if (alert.alvisto) return null;
      
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => meta.onMarkAsViewed(alert.alid)}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
          >
            Marcar visto
          </Button>
        </div>
      );
    },
  },
];
