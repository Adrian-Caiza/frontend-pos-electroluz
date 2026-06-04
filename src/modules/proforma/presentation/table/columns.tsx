import type { ColumnDef } from '@tanstack/react-table';
import type { Proforma } from '../../domain/Proforma';
import { DataTableColumnHeader } from '../../../../shared/components/ui/data-table/DataTableColumnHeader';
import { DataTableCheckbox } from '../../../../shared/components/ui/data-table/DataTableCheckbox';
import { DataTableRowActions, type DataTableRowActionItem } from '../../../../shared/components/ui/data-table/DataTableRowActions';
import { Receipt, CheckCircle2, XCircle, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '../../../../shared/components/ui/badge';

export interface ProformaTableMeta {
  onCancel: (id: string) => void;
  onPay: (id: string) => void;
  onEdit: (id: string) => void;
  isCanceling: boolean;
  isPaying: boolean;
}

export const columns: ColumnDef<Proforma>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <DataTableCheckbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <DataTableCheckbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'prfmaidentificador',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Comprobante" />,
    cell: ({ row }) => {
      const proforma = row.original;
      return (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 text-slate-600">
            <Receipt className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-slate-900">{proforma.prfmaidentificador}</span>
            <span className="text-xs text-slate-500">
              {format(new Date(proforma.prfmafchregistro), "d MMM yyyy, HH:mm", { locale: es })}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'cliente',
    accessorFn: (row) => `${row.receptor.clntenombre || (row.receptor as any).cliente?.clntenombre} ${row.receptor.clnteidentificacion || (row.receptor as any).cliente?.clnteidentificacion || (row.receptor as any).identificacion || ''}`,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
    cell: ({ row }) => {
      const receptor = row.original.receptor;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-900">{receptor.clntenombre || (receptor as any).cliente?.clntenombre}</span>
          <span className="text-xs text-slate-500">CI/RUC: {receptor.clnteidentificacion || (receptor as any).cliente?.clnteidentificacion || (receptor as any).identificacion || (receptor as any).clntedocumento || 'N/A'}</span>
        </div>
      );
    },
  },
  {
    id: 'metodopago',
    accessorFn: (row) => row.metodoPago.mpnombre,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Método de Pago" />,
    cell: ({ row }) => (
      <span className="text-slate-600 text-sm">
        {row.original.metodoPago.mpnombre}
      </span>
    ),
  },
  {
    id: 'total',
    accessorFn: (row) => row.total.prfmatotal,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total" className="justify-end" />,
    cell: ({ row }) => (
      <div className="text-right w-full">
        <span className="font-bold text-slate-900">
          ${row.original.total.prfmatotal.toFixed(2)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'prfmaestado',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" className="justify-center" />,
    cell: ({ row }) => {
      const estado = row.getValue('prfmaestado') as string;
      return (
        <div className="flex w-full justify-center">
          <Badge
            variant="outline"
            className={
              estado === 'pagada'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : estado === 'cancelada'
                ? 'bg-rose-100 text-rose-800 border-rose-200'
                : 'bg-amber-100 text-amber-800 border-amber-200'
            }
          >
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </Badge>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Acciones" className="text-center w-full block" />,
    cell: ({ row, table }) => {
      const meta = table.options.meta as ProformaTableMeta;
      const proforma = row.original;

      if (proforma.prfmaestado !== 'emitida') {
        return (
          <div className="flex justify-center w-full">
            <span className="text-xs text-slate-400 italic">Sin acciones</span>
          </div>
        );
      }

      const actions: DataTableRowActionItem[] = [
        {
          label: 'Editar Proforma',
          icon: <Pencil className="h-4 w-4 text-blue-600" />,
          onClick: () => meta.onEdit(proforma.prfmaid),
        },
        {
          label: 'Registrar Pago',
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
          onClick: () => meta.onPay(proforma.prfmaid),
        },
        {
          label: 'Cancelar Proforma',
          icon: <XCircle className="h-4 w-4 text-rose-600" />,
          onClick: () => meta.onCancel(proforma.prfmaid),
          variant: 'danger',
          separatorAbove: true
        }
      ];

      return (
        <div className="flex justify-center">
          <DataTableRowActions title="Acciones" actions={actions} />
        </div>
      );
    },
  },
];
