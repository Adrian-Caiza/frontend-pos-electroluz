import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../../../../shared/components/ui/badge';
import type { Checkout } from '../../domain/entities/Checkout';
import { DataTableColumnHeader } from '../../../../shared/components/ui/data-table/DataTableColumnHeader';
import { DataTableCheckbox } from '../../../../shared/components/ui/data-table/DataTableCheckbox';
import { DataTableRowActions } from '../../../../shared/components/ui/data-table/DataTableRowActions';
import type { DataTableRowActionItem } from '../../../../shared/components/ui/data-table/DataTableRowActions';
import { DataTableStatusBadge } from '../../../../shared/components/ui/data-table/DataTableStatusBadge';
import { CheckCircle2, ShieldOff, Trash2 } from 'lucide-react';

export interface CheckoutTableMeta {
  isJefe: boolean;
  onChangeStatus: (id: string, newStatus: 'activo' | 'inactivo' | 'eliminado') => void;
}

export const columns: ColumnDef<Checkout>[] = [
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
    accessorKey: 'cjidentificador',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Identificador" />,
    cell: ({ row }) => {
      return (
        <span className="font-medium text-slate-900">
          Caja {row.getValue('cjidentificador')}
        </span>
      );
    },
  },
  {
    accessorFn: (row) => row.sucursal?.sunombre || 'N/A',
    id: 'sucursal',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sucursal" />,
    cell: ({ row }) => {
      return <span className="text-slate-600">{row.getValue('sucursal')}</span>;
    },
  },
  {
    accessorKey: 'cjestado',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => <DataTableStatusBadge status={row.getValue('cjestado')} />,
  },
  {
    accessorKey: 'cjfchregistro',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha Registro" />,
    cell: ({ row }) => {
      const dateStr = row.getValue('cjfchregistro') as string;
      return <span className="text-slate-500">{new Date(dateStr).toLocaleDateString()}</span>;
    },
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Acciones" className="justify-end" />,
    cell: ({ row, table }) => {
      const meta = table.options.meta as CheckoutTableMeta;
      const checkout = row.original;

      if (!meta?.isJefe) return null;

      const actions: DataTableRowActionItem[] = [];
      
      if (checkout.cjestado !== 'activo' && checkout.cjestado !== 'eliminado') {
        actions.push({
          label: 'Marcar Activo',
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
          onClick: () => meta.onChangeStatus(checkout.cjid, 'activo')
        });
      }
      
      if (checkout.cjestado !== 'inactivo' && checkout.cjestado !== 'eliminado') {
        actions.push({
          label: 'Marcar Inactivo',
          icon: <ShieldOff className="h-4 w-4 text-amber-600" />,
          onClick: () => meta.onChangeStatus(checkout.cjid, 'inactivo')
        });
      }
      
      if (checkout.cjestado !== 'eliminado') {
        actions.push({
          label: 'Eliminar',
          icon: <Trash2 className="h-4 w-4" />,
          onClick: () => meta.onChangeStatus(checkout.cjid, 'eliminado'),
          variant: 'danger',
          separatorAbove: true
        });
      }

      return (
        <div className="flex justify-end">
          <DataTableRowActions actions={actions} />
        </div>
      );
    },
  },
];
