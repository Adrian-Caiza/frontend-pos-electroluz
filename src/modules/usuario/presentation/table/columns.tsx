import type { ColumnDef } from '@tanstack/react-table';
import type { Usuario } from '../../domain/entities/Usuario';
import { DataTableColumnHeader } from '../../../../shared/components/ui/data-table/DataTableColumnHeader';
import { DataTableCheckbox } from '../../../../shared/components/ui/data-table/DataTableCheckbox';
import { DataTableStatusBadge } from '../../../../shared/components/ui/data-table/DataTableStatusBadge';
import { DataTableRowActions, type DataTableRowActionItem } from '../../../../shared/components/ui/data-table/DataTableRowActions';
import { DataTableAvatarCell } from '../../../../shared/components/ui/data-table/DataTableAvatarCell';
import { Badge } from '../../../../shared/components/ui/badge';
import { Pencil, CheckCircle, Ban, Trash2, Shield } from 'lucide-react';

export interface UsuarioTableMeta {
  isJefe: boolean;
  onEdit: (usuario: Usuario) => void;
  onStatusChange: (usuario: Usuario, newStatus: 'activo' | 'inactivo' | 'eliminado') => void;
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'administrador':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100"><Shield className="w-3 h-3 mr-1" />Admin</Badge>;
    case 'jefe':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Jefe</Badge>;
    case 'empleado':
      return <Badge className="bg-muted text-foreground hover:bg-muted/80">Empleado</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

import { getImageUrl } from '../../../../shared/utils/getImageUrl';

export const columns: ColumnDef<Usuario>[] = [
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
    accessorKey: 'usnombre',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Personal" />,
    cell: ({ row }) => {
      const usuario = row.original;
      return (
        <DataTableAvatarCell
          name={usuario.usnombre}
          subtitle={`@${usuario.usapodo}`}
          imageUrl={getImageUrl(usuario.usimagen)}
        />
      );
    },
  },
  {
    accessorKey: 'uscorreo',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Contacto" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue('uscorreo')}</span>
    ),
  },
  {
    accessorKey: 'usrol',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rol Operativo" />,
    cell: ({ row }) => getRoleBadge(row.getValue('usrol')),
  },
  {
    accessorKey: 'usestado',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" className="justify-center" />,
    cell: ({ row }) => (
      <div className="flex w-full justify-center">
        <DataTableStatusBadge status={row.getValue('usestado')} />
      </div>
    ),
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Acciones" className="text-center w-full block" />,
    cell: ({ row, table }) => {
      const meta = table.options.meta as UsuarioTableMeta;
      const usuario = row.original;

      if (!meta?.isJefe || usuario.usestado === 'eliminado') return null;

      const actions: DataTableRowActionItem[] = [
        {
          label: 'Editar Perfil / Rol',
          icon: <Pencil className="h-4 w-4" />,
          onClick: () => meta.onEdit(usuario)
        }
      ];

      if (usuario.usestado === 'activo') {
        actions.push({
          label: 'Marcar como Inactivo',
          icon: <Ban className="h-4 w-4 text-amber-600" />,
          onClick: () => meta.onStatusChange(usuario, 'inactivo')
        });
      } else {
        actions.push({
          label: 'Marcar como Activo',
          icon: <CheckCircle className="h-4 w-4 text-emerald-600" />,
          onClick: () => meta.onStatusChange(usuario, 'activo')
        });
      }

      actions.push({
        label: 'Dar de Baja (Eliminar)',
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => meta.onStatusChange(usuario, 'eliminado'),
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
