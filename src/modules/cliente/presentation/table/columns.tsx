import type { ColumnDef } from '@tanstack/react-table';
import type { Cliente } from '../../domain/entities/Cliente';
import { DataTableColumnHeader } from '../../../../shared/components/ui/data-table/DataTableColumnHeader';
import { DataTableCheckbox } from '../../../../shared/components/ui/data-table/DataTableCheckbox';
import { DataTableRowActions } from '../../../../shared/components/ui/data-table/DataTableRowActions';
import type { DataTableRowActionItem } from '../../../../shared/components/ui/data-table/DataTableRowActions';
import { DataTableStatusBadge } from '../../../../shared/components/ui/data-table/DataTableStatusBadge';
import { MapPin, Mail, Phone, Edit, UserCheck, UserMinus, Trash2 } from 'lucide-react';

export interface ClienteTableMeta {
  onEdit: (cliente: Cliente) => void;
  onChangeStatus: (cliente: Cliente, newStatus: 'activo' | 'inactivo' | 'eliminado') => void;
}

export const columns: ColumnDef<Cliente>[] = [
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
    accessorKey: 'clntenombre',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
    cell: ({ row }) => {
      const cliente = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{cliente.clntenombre}</span>
          <span className="text-xs text-slate-500 mt-1 flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {cliente.clntedireccion}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'clnteidentificacion',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Identificación" />,
    cell: ({ row }) => {
      const cliente = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm text-slate-700">{cliente.clnteidentificacion}</span>
          <span className="text-xs text-slate-500 uppercase">{cliente.clntetipoidentificacion}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'contacto',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Contacto" />,
    cell: ({ row }) => {
      const cliente = row.original;
      return (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-sm text-slate-600">
            <Mail className="w-3 h-3 mr-2" />
            {cliente.clntecorreo}
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <Phone className="w-3 h-3 mr-2" />
            {cliente.clntetelefono}
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'clnteestado',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" className="justify-center" />,
    cell: ({ row }) => (
      <div className="flex w-full justify-center">
        <DataTableStatusBadge status={row.getValue('clnteestado')} />
      </div>
    ),
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Acciones" className="text-center w-full block" />,
    cell: ({ row, table }) => {
      const meta = table.options.meta as ClienteTableMeta;
      const cliente = row.original;

      const actions: DataTableRowActionItem[] = [
        {
          label: 'Editar información',
          icon: <Edit className="h-4 w-4" />,
          onClick: () => meta.onEdit(cliente)
        }
      ];

      if (cliente.clnteestado === 'activo') {
        actions.push({
          label: 'Marcar como inactivo',
          icon: <UserMinus className="h-4 w-4 text-amber-600" />,
          onClick: () => meta.onChangeStatus(cliente, 'inactivo')
        });
      } else {
        actions.push({
          label: 'Marcar como activo',
          icon: <UserCheck className="h-4 w-4 text-emerald-600" />,
          onClick: () => meta.onChangeStatus(cliente, 'activo')
        });
      }

      actions.push({
        label: 'Dar de baja',
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => meta.onChangeStatus(cliente, 'eliminado'),
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
