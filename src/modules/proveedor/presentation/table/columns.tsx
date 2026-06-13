import type { ColumnDef } from '@tanstack/react-table';
import type { Proveedor } from '../../domain/entities/Proveedor';
import { DataTableColumnHeader } from '../../../../shared/components/ui/data-table/DataTableColumnHeader';
import { DataTableCheckbox } from '../../../../shared/components/ui/data-table/DataTableCheckbox';
import { DataTableStatusBadge } from '../../../../shared/components/ui/data-table/DataTableStatusBadge';
import { DataTableRowActions, type DataTableRowActionItem } from '../../../../shared/components/ui/data-table/DataTableRowActions';
import { Truck, Pencil, Ban, CheckCircle, Trash2, Phone, Mail, FolderTree, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface ProveedorTableMeta {
  isJefeOrEmpleado: boolean;
  onEdit: (proveedor: Proveedor) => void;
  onStatusChange: (proveedor: Proveedor, newStatus: 'activo' | 'inactivo' | 'eliminado') => void;
}

export const columns: ColumnDef<Proveedor>[] = [
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
    accessorKey: 'provnombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Proveedor" />
    ),
    cell: ({ row }) => {
      const nombre = row.getValue('provnombre') as string;
      return (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mr-3 shrink-0">
            <Truck className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium text-foreground">{nombre}</span>
        </div>
      );
    },
  },
  {
    id: 'contacto',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contacto" />
    ),
    cell: ({ row }) => {
      const telefono = row.original.provtelefono;
      const correo = row.original.provcorreo;
      
      if (!telefono && !correo) {
        return <span className="text-muted-foreground text-sm italic">Sin contacto</span>;
      }
      
      return (
        <div className="flex flex-col gap-1 text-sm">
          {telefono && (
            <div className="flex items-center text-muted-foreground">
              <Phone className="w-3 h-3 mr-1.5" />
              {telefono}
            </div>
          )}
          {correo && (
            <div className="flex items-center text-muted-foreground">
              <Mail className="w-3 h-3 mr-1.5" />
              {correo}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: 'especialidad',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Especialidad" />
    ),
    cell: ({ row }) => {
      const categoria = row.original.categoria;
      const marca = row.original.marca;
      
      if (!categoria && !marca) {
        return <span className="text-muted-foreground text-sm italic">-</span>;
      }
      
      return (
        <div className="flex flex-col gap-1 text-sm">
          {categoria && (
            <div className="flex items-center text-muted-foreground">
              <FolderTree className="w-3 h-3 mr-1.5" />
              {categoria.ctgnombre}
            </div>
          )}
          {marca && (
            <div className="flex items-center text-muted-foreground">
              <Tag className="w-3 h-3 mr-1.5" />
              {marca.mrcnombre}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'provfchregistro',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Registro" />
    ),
    cell: ({ row }) => {
      const fecha = row.getValue('provfchregistro') as string;
      return (
        <div className="text-muted-foreground text-sm">
          {format(new Date(fecha), "d 'de' MMMM, yyyy", { locale: es })}
        </div>
      );
    },
  },
  {
    accessorKey: 'provestado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" className="justify-center" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('provestado') as 'activo' | 'inactivo';
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
      const proveedor = row.original;
      const meta = table.options.meta as ProveedorTableMeta | undefined;
      
      if (!meta?.isJefeOrEmpleado) return null;

      const actions: DataTableRowActionItem[] = [
        {
          label: 'Editar',
          icon: <Pencil className="h-4 w-4" />,
          onClick: () => meta.onEdit(proveedor),
        },
      ];

      if (proveedor.provestado === 'activo') {
        actions.push({
          label: 'Inactivar',
          icon: <Ban className="h-4 w-4" />,
          onClick: () => meta.onStatusChange(proveedor, 'inactivo'),
          variant: 'warning',
        });
      } else if (proveedor.provestado === 'inactivo') {
        actions.push({
          label: 'Activar',
          icon: <CheckCircle className="h-4 w-4" />,
          onClick: () => meta.onStatusChange(proveedor, 'activo'),
          variant: 'default',
        });
      }

      actions.push({
        label: 'Eliminar',
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => meta.onStatusChange(proveedor, 'eliminado'),
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
