import type { ColumnDef } from '@tanstack/react-table';
import type { Sucursal } from '../../domain/entities/Sucursal';
import { DataTableColumnHeader } from '../../../../shared/components/ui/data-table/DataTableColumnHeader';
import { DataTableCheckbox } from '../../../../shared/components/ui/data-table/DataTableCheckbox';
import { DataTableStatusBadge } from '../../../../shared/components/ui/data-table/DataTableStatusBadge';
import { DataTableRowActions, type DataTableRowActionItem } from '../../../../shared/components/ui/data-table/DataTableRowActions';
import { Pencil, CheckCircle, Ban, Trash2 } from 'lucide-react';

export interface SucursalTableMeta {
  isJefe: boolean;
  onEdit: (sucursal: Sucursal) => void;
  onStatusChange: (sucursal: Sucursal, newStatus: 'activo' | 'inactivo' | 'eliminado') => void;
}

export const columns: ColumnDef<Sucursal>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex justify-center w-full px-1">
        <DataTableCheckbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center w-full px-1">
        <DataTableCheckbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'suidentificador',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Identificador" />,
    cell: ({ row }) => (
      <span className="font-medium text-foreground">
        ID: {row.getValue('suidentificador')}
      </span>
    ),
  },
  {
    accessorKey: 'sunombre',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
    cell: ({ row }) => (
      <span className="text-foreground font-semibold">
        {row.getValue('sunombre')}
      </span>
    ),
  },
  {
    id: 'contacto',
    accessorFn: (row) => `${row.sudireccion || ''} ${row.sucorreo || ''}`,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Dirección / Correo" />,
    cell: ({ row }) => {
      const sucursal = row.original;
      return (
        <div className="text-muted-foreground text-sm">
          {sucursal.sudireccion ? <div>{sucursal.sudireccion}</div> : null}
          {sucursal.sucorreo ? <div className="text-muted-foreground">{sucursal.sucorreo}</div> : null}
          {!sucursal.sudireccion && !sucursal.sucorreo && <span className="text-muted-foreground">N/A</span>}
        </div>
      );
    },
  },
  {
    accessorKey: 'suestado',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" className="justify-center" />,
    cell: ({ row }) => (
      <div className="flex w-full justify-center">
        <DataTableStatusBadge status={row.getValue('suestado')} />
      </div>
    ),
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Acciones" className="text-center w-full block" />,
    cell: ({ row, table }) => {
      const meta = table.options.meta as SucursalTableMeta;
      const sucursal = row.original;

      if (!meta?.isJefe || sucursal.suestado === 'eliminado') return null;

      const actions: DataTableRowActionItem[] = [
        {
          label: 'Editar',
          icon: <Pencil className="h-4 w-4" />,
          onClick: () => meta.onEdit(sucursal)
        }
      ];

      if (sucursal.suestado === 'activo') {
        actions.push({
          label: 'Marcar como Inactivo',
          icon: <Ban className="h-4 w-4" />,
          onClick: () => meta.onStatusChange(sucursal, 'inactivo'),
          variant: 'warning',
        });
      } else {
        actions.push({
          label: 'Marcar como Activo',
          icon: <CheckCircle className="h-4 w-4 text-emerald-600" />,
          onClick: () => meta.onStatusChange(sucursal, 'activo')
        });
      }

      actions.push({
        label: 'Eliminar',
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => meta.onStatusChange(sucursal, 'eliminado'),
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
