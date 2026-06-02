import type { ColumnDef } from '@tanstack/react-table';
import type { MetodoPago } from '../../domain/MetodoPago';
import { DataTableColumnHeader } from '../../../../shared/components/ui/data-table/DataTableColumnHeader';
import { DataTableCheckbox } from '../../../../shared/components/ui/data-table/DataTableCheckbox';
import { DataTableStatusBadge } from '../../../../shared/components/ui/data-table/DataTableStatusBadge';
import { DataTableRowActions, type DataTableRowActionItem } from '../../../../shared/components/ui/data-table/DataTableRowActions';
import { Wallet, Pencil, Ban, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface MetodoPagoTableMeta {
  isJefe: boolean;
  onEdit: (metodo: MetodoPago) => void;
  onStatusChange: (metodo: MetodoPago, newStatus: 'activo' | 'inactivo') => void;
}

export const columns: ColumnDef<MetodoPago>[] = [
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
    accessorKey: 'mpnombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre del Método" />
    ),
    cell: ({ row }) => {
      const nombre = row.getValue('mpnombre') as string;
      return (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3 text-indigo-600">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="font-medium text-slate-900">{nombre}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'mpfchregistro',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha Registro" />
    ),
    cell: ({ row }) => {
      const fecha = row.getValue('mpfchregistro') as string;
      return (
        <div className="text-slate-500 text-sm">
          {format(new Date(fecha), "d 'de' MMMM, yyyy", { locale: es })}
        </div>
      );
    },
  },
  {
    accessorKey: 'mpestado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" className="justify-center" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('mpestado') as 'activo' | 'inactivo';
      return (
        <div className="flex w-full justify-center">
          <DataTableStatusBadge status={status} />
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Acciones" className="text-center w-full block" />,
    cell: ({ row, table }) => {
      const meta = table.options.meta as MetodoPagoTableMeta;
      const metodo = row.original;
      
      const actions: DataTableRowActionItem[] = [
        {
          label: "Actualizar / Cambiar Estado",
          icon: <Pencil className="h-4 w-4" />,
          onClick: () => meta.onEdit(metodo)
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
