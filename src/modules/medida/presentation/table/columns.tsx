import type { ColumnDef } from '@tanstack/react-table';
import type { Medida } from '../../domain/entities/Medida';
import { DataTableColumnHeader } from '../../../../shared/components/ui/data-table/DataTableColumnHeader';
import { DataTableCheckbox } from '../../../../shared/components/ui/data-table/DataTableCheckbox';
import { DataTableStatusBadge } from '../../../../shared/components/ui/data-table/DataTableStatusBadge';
import { DataTableRowActions, type DataTableRowActionItem } from '../../../../shared/components/ui/data-table/DataTableRowActions';
import { Scale, Pencil, Ban, CheckCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface MedidaTableMeta {
  isJefeOrEmpleado: boolean;
  onEdit: (medida: Medida) => void;
  onStatusChange: (medida: Medida, newStatus: 'activo' | 'inactivo' | 'eliminado') => void;
}

export const columns: ColumnDef<Medida>[] = [
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
    accessorKey: 'mdianombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medida" />
    ),
    cell: ({ row }) => {
      const nombre = row.getValue('mdianombre') as string;
      const abreviatura = row.original.mdiaabreviatura;
      return (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mr-3 shrink-0">
            <Scale className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="font-medium block">{nombre}</span>
            <span className="text-xs text-muted-foreground uppercase">{abreviatura}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'mdiafchregistro',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Registro" />
    ),
    cell: ({ row }) => {
      const fecha = row.getValue('mdiafchregistro') as string;
      return (
        <div className="text-muted-foreground text-sm">
          {format(new Date(fecha), "d 'de' MMMM, yyyy", { locale: es })}
        </div>
      );
    },
  },
  {
    accessorKey: 'mdiaestado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" className="justify-center" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('mdiaestado') as 'activo' | 'inactivo';
      return (
        <div className="flex w-full justify-center">
          <DataTableStatusBadge status={status} />
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Acciones" className="justify-center" />,
    cell: ({ row, table }) => {
      const medida = row.original;
      const meta = table.options.meta as MedidaTableMeta | undefined;
      
      if (!meta?.isJefeOrEmpleado) return null;

      const actions: DataTableRowActionItem[] = [
        {
          label: 'Editar',
          icon: <Pencil className="h-4 w-4" />,
          onClick: () => meta.onEdit(medida),
        },
      ];

      if (medida.mdiaestado === 'activo') {
        actions.push({
          label: 'Inactivar',
          icon: <Ban className="h-4 w-4" />,
          onClick: () => meta.onStatusChange(medida, 'inactivo'),
          variant: 'warning',
        });
      } else if (medida.mdiaestado === 'inactivo') {
        actions.push({
          label: 'Activar',
          icon: <CheckCircle className="h-4 w-4" />,
          onClick: () => meta.onStatusChange(medida, 'activo'),
          variant: 'default',
        });
      }

      actions.push({
        label: 'Eliminar',
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => meta.onStatusChange(medida, 'eliminado'),
        variant: 'danger',
        separatorAbove: true,
      });

      return (
        <div className="flex justify-center">
          <DataTableRowActions actions={actions} />
        </div>
      );
    },
  },
];
