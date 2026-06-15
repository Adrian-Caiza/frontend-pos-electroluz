import type { ColumnDef } from '@tanstack/react-table';
import type { Categoria } from '../../domain/entities/Categoria';
import { DataTableColumnHeader } from '../../../../shared/components/ui/data-table/DataTableColumnHeader';
import { DataTableCheckbox } from '../../../../shared/components/ui/data-table/DataTableCheckbox';
import { DataTableStatusBadge } from '../../../../shared/components/ui/data-table/DataTableStatusBadge';
import { DataTableRowActions, type DataTableRowActionItem } from '../../../../shared/components/ui/data-table/DataTableRowActions';
import { Tags, Pencil, Ban, CheckCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface CategoriaTableMeta {
  isJefe: boolean;
  onEdit: (categoria: Categoria) => void;
  onStatusChange: (categoria: Categoria, newStatus: 'activo' | 'inactivo' | 'eliminado') => void;
}

export const columns: ColumnDef<Categoria>[] = [
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
    accessorKey: 'ctgnombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      const nombre = row.getValue('ctgnombre') as string;
      return (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3 text-indigo-600">
            <Tags className="w-4 h-4" />
          </div>
          <span className="font-medium text-foreground">{nombre}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'ctgriadescripcion',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
    cell: ({ row }) => {
      const descripcion = row.getValue('ctgriadescripcion') as string;
      return (
        <span className="text-muted-foreground truncate max-w-[200px] block">
          {descripcion || 'Sin descripción'}
        </span>
      );
    },
  },
  {
    accessorKey: 'ctgriafchregistro',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha Registro" />
    ),
    cell: ({ row }) => {
      const fecha = row.getValue('ctgriafchregistro') as string;
      if (!fecha) return <span className="text-muted-foreground">-</span>;
      return (
        <span className="text-muted-foreground">
          {format(new Date(fecha), "d 'de' MMMM, yyyy", { locale: es })}
        </span>
      );
    },
  },
  {
    accessorKey: 'ctgriaestado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" className="justify-center" />
    ),
    cell: ({ row }) => {
      const estado = row.getValue('ctgriaestado') as string;
      return (
        <div className="flex justify-center">
          <DataTableStatusBadge status={estado} />
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Acciones" className="justify-center" />,
    cell: ({ row, table }) => {
      const categoria = row.original;
      const meta = table.options.meta as CategoriaTableMeta | undefined;
      
      if (!meta?.isJefe) return null;

      const actions: DataTableRowActionItem[] = [
        {
          label: 'Editar',
          icon: <Pencil className="h-4 w-4" />,
          onClick: () => meta.onEdit(categoria),
        },
      ];

      if (categoria.ctgriaestado === 'activo') {
        actions.push({
          label: 'Inactivar',
          icon: <Ban className="h-4 w-4" />,
          onClick: () => meta.onStatusChange(categoria, 'inactivo'),
          variant: 'warning',
        });
      } else if (categoria.ctgriaestado === 'inactivo') {
        actions.push({
          label: 'Activar',
          icon: <CheckCircle className="h-4 w-4" />,
          onClick: () => meta.onStatusChange(categoria, 'activo'),
          variant: 'default',
        });
      }

      actions.push({
        label: 'Eliminar',
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => meta.onStatusChange(categoria, 'eliminado'),
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
