import type { ColumnDef } from '@tanstack/react-table';
import type { Marca } from '../../domain/entities/Marca';
import { DataTableColumnHeader } from '../../../../shared/components/ui/data-table/DataTableColumnHeader';
import { DataTableCheckbox } from '../../../../shared/components/ui/data-table/DataTableCheckbox';
import { DataTableStatusBadge } from '../../../../shared/components/ui/data-table/DataTableStatusBadge';
import { DataTableRowActions, type DataTableRowActionItem } from '../../../../shared/components/ui/data-table/DataTableRowActions';
import { Tag, Pencil, Ban, CheckCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface MarcaTableMeta {
  isJefe: boolean;
  onEdit: (marca: Marca) => void;
  onStatusChange: (marca: Marca, newStatus: 'activo' | 'inactivo' | 'eliminado') => void;
}

export const columns: ColumnDef<Marca>[] = [
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
    accessorKey: 'mrcnombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Marca" />
    ),
    cell: ({ row }) => {
      const nombre = row.getValue('mrcnombre') as string;
      return (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mr-3 shrink-0">
            <Tag className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{nombre}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'mrcfchregistro',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Registro" />
    ),
    cell: ({ row }) => {
      const fecha = row.getValue('mrcfchregistro') as string;
      return (
        <div className="text-muted-foreground text-sm">
          {format(new Date(fecha), "d 'de' MMMM, yyyy", { locale: es })}
        </div>
      );
    },
  },
  {
    accessorKey: 'mrcestado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" className="justify-center" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('mrcestado') as 'activo' | 'inactivo';
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
      const marca = row.original;
      const meta = table.options.meta as MarcaTableMeta | undefined;
      
      if (!meta?.isJefe) return null;

      const actions: DataTableRowActionItem[] = [
        {
          label: 'Editar',
          icon: <Pencil className="h-4 w-4" />,
          onClick: () => meta.onEdit(marca),
        },
      ];

      if (marca.mrcestado === 'activo') {
        actions.push({
          label: 'Inactivar',
          icon: <Ban className="h-4 w-4" />,
          onClick: () => meta.onStatusChange(marca, 'inactivo'),
          variant: 'warning',
        });
      } else if (marca.mrcestado === 'inactivo') {
        actions.push({
          label: 'Activar',
          icon: <CheckCircle className="h-4 w-4" />,
          onClick: () => meta.onStatusChange(marca, 'activo'),
          variant: 'default',
        });
      }

      actions.push({
        label: 'Eliminar',
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => meta.onStatusChange(marca, 'eliminado'),
        variant: 'danger',
        separatorAbove: true,
      });

      return (
        <div className="flex justify-center">
          <DataTableRowActions title="Acciones" actions={actions} />
        </div>
      );
    },
  },
];
