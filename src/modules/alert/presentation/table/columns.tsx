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
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 border border-slate-100">
          {alert.type === 'stock_bajo' ? (
            <PackageSearch className={cn("w-4 h-4", !alert.isViewed ? "text-red-500" : "text-slate-400")} />
          ) : (
            <AlertTriangle className={cn("w-4 h-4", !alert.isViewed ? "text-red-500" : "text-slate-400")} />
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
      
      let displayMessage = alert.message;
      if (alert.type === 'stock_bajo') {
        // If the message is long, we can keep it as is, or extract parts if needed.
        // The endpoint provides 'almensaje' which is already descriptive.
      }

      return (
        <div className="flex flex-col py-1">
          <span className={cn("text-[13px]", !alert.isViewed ? "font-bold text-slate-900" : "font-medium text-slate-700")}>
            {displayMessage}
          </span>
          {alert.type === 'stock_bajo' && alert.currentQuantity !== undefined && (
            <div className="flex items-center gap-3 mt-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-600 border border-red-100">
                Actual: {alert.currentQuantity}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                Mínimo: {alert.minStock}
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
      return <span className="text-sm font-medium text-slate-600">{row.original.branch?.name || 'N/A'}</span>;
    },
  },
  {
    id: 'producto',
    header: 'Producto',
    cell: ({ row }) => {
      return <span className="text-sm font-medium text-slate-600">{row.original.product?.name || 'N/A'}</span>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha y Hora',
    cell: ({ row }) => {
      return <span className="whitespace-nowrap text-sm text-slate-500">{new Date(row.original.createdAt).toLocaleString()}</span>;
    },
  },
  {
    id: 'actions',
    header: '',
    size: 100,
    cell: ({ row, table }) => {
      const alert = row.original;
      const meta = table.options.meta as AlertTableMeta;
      
      if (alert.isViewed) return null;
      
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => meta.onMarkAsViewed(alert.id)}
            className="h-8 px-3 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            Marcar como leído
          </Button>
        </div>
      );
    },
  },
];
