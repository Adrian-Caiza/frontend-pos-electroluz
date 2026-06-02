import type { ColumnDef } from '@tanstack/react-table';
import type { Stock } from '../../domain/entities/Stock';
import { DataTableColumnHeader } from '../../../../shared/components/ui/data-table/DataTableColumnHeader';
import { DataTableCheckbox } from '../../../../shared/components/ui/data-table/DataTableCheckbox';
import { DataTableStatusBadge } from '../../../../shared/components/ui/data-table/DataTableStatusBadge';
import { DataTableRowActions, type DataTableRowActionItem } from '../../../../shared/components/ui/data-table/DataTableRowActions';
import { Edit, PackageCheck, PackageX, Trash2, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface StockTableMeta {
  sucursalId: string;
  onEdit: (stock: Stock) => void;
  onStatusChange: (stock: Stock, newStatus: 'activo' | 'inactivo' | 'eliminado') => void;
}

export const columns: ColumnDef<Stock>[] = [
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
    accessorKey: 'producto',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Producto" />,
    cell: ({ row }) => {
      const stock = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{stock.producto.prdtonombre}</span>
          <span className="text-xs text-slate-500 mt-1 flex items-center">
            <Tag className="w-3 h-3 mr-1" />
            Código: {stock.producto.prdtocodigo}
          </span>
        </div>
      );
    },
  },
  {
    id: 'cantidadMinima',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cantidad Mínima" className="justify-center" />,
    cell: () => (
      <div className="text-center text-slate-500 w-full">N/A</div>
    ),
  },
  {
    accessorKey: 'stckcantidad',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Existencias" className="justify-end" />,
    cell: ({ row }) => {
      const stock = row.original;
      return (
        <div className="text-right w-full">
          <span className={`text-lg font-bold ${Number(stock.stckcantidad) <= 10 ? 'text-rose-600' : 'text-slate-700'}`}>
            {Number(stock.stckcantidad)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'stckfchregistro',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha Registro" />,
    cell: ({ row }) => {
      const dateStr = row.getValue('stckfchregistro') as string;
      return <span className="text-slate-500">{format(new Date(dateStr), "d 'de' MMMM, yyyy", { locale: es })}</span>;
    },
  },
  {
    accessorKey: 'stckestado',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" className="justify-center" />,
    cell: ({ row }) => (
      <div className="flex w-full justify-center">
        <DataTableStatusBadge status={row.getValue('stckestado')} />
      </div>
    ),
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Acciones" className="text-center w-full block" />,
    cell: ({ row, table }) => {
      const meta = table.options.meta as StockTableMeta;
      const stock = row.original;

      if (stock.stckestado === 'eliminado') return null;

      const actions: DataTableRowActionItem[] = [
        {
          label: 'Ajustar cantidad',
          icon: <Edit className="h-4 w-4" />,
          onClick: () => meta.onEdit(stock)
        }
      ];

      if (stock.stckestado === 'activo') {
        actions.push({
          label: 'Bloquear lote (inactivo)',
          icon: <PackageX className="h-4 w-4 text-amber-600" />,
          onClick: () => meta.onStatusChange(stock, 'inactivo')
        });
      } else {
        actions.push({
          label: 'Liberar lote (activo)',
          icon: <PackageCheck className="h-4 w-4 text-emerald-600" />,
          onClick: () => meta.onStatusChange(stock, 'activo')
        });
      }

      actions.push({
        label: 'Dar de baja',
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => meta.onStatusChange(stock, 'eliminado'),
        variant: 'danger',
        separatorAbove: true
      });

      return (
        <div className="flex justify-center">
          <DataTableRowActions title="Acciones" actions={actions} />
        </div>
      );
    },
  },
];
