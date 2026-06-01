import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2, Ban, CheckCircle } from "lucide-react"
import type { Producto } from "../../domain/entities/Producto"
import { DataTableColumnHeader } from "../../../../shared/components/ui/data-table/DataTableColumnHeader"
import { DataTableCheckbox } from "../../../../shared/components/ui/data-table/DataTableCheckbox"
import { DataTableRowIndicator } from "../../../../shared/components/ui/data-table/DataTableRowIndicator"
import { DataTableProductCell } from "../../../../shared/components/ui/data-table/DataTableProductCell"
import { DataTablePriceCell } from "../../../../shared/components/ui/data-table/DataTablePriceCell"
import { DataTableStockCell } from "../../../../shared/components/ui/data-table/DataTableStockCell"
import { DataTableStatusBadge } from "../../../../shared/components/ui/data-table/DataTableStatusBadge"
import { DataTableRowActions, type DataTableRowActionItem } from "../../../../shared/components/ui/data-table/DataTableRowActions"

// Helper para parsear la URL de la imagen
export const getImageUrl = (rawPath: string | null) => {
  if (!rawPath || rawPath === 'null' || rawPath === 'undefined' || rawPath.trim() === '') return null;

  const imagePath = rawPath.replace(/\\/g, '/');
  if (imagePath.startsWith('blob:')) return imagePath;

  if (imagePath.startsWith('http')) {
    try {
      const url = new URL(imagePath);
      const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
      const isApiHost = import.meta.env.VITE_API_URL && url.hostname === new URL(import.meta.env.VITE_API_URL).hostname;
      const isKnownIP = url.hostname === '163.245.192.54';

      if (isLocalhost || isApiHost || isKnownIP) {
        return `/api-proxy${url.pathname}`;
      }
      return imagePath;
    } catch (e) {
      return imagePath;
    }
  }

  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `/api-proxy${path}`;
};

export interface ProductoTableMeta {
  isJefe: boolean
  onEdit: (producto: Producto) => void
  onStatusChange: (producto: Producto, newStatus: 'activo' | 'inactivo' | 'eliminado') => void
}

export const columns: ColumnDef<Producto>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex w-full justify-center px-1">
        <DataTableCheckbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          ariaLabel="Seleccionar todos"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex w-full justify-center px-1">
        <DataTableCheckbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          ariaLabel="Seleccionar fila"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "indicator",
    header: () => <div className="w-2"></div>,
    cell: ({ row }) => (
      <div className="flex w-full justify-center">
        <DataTableRowIndicator status={row.original.prdtoestado} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "prdtonombre",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Producto" />
    ),
    cell: ({ row }) => {
      const producto = row.original;
      return (
        <DataTableProductCell
          name={producto.prdtonombre}
          sku={producto.prdtocodigo}
          imageUrl={getImageUrl(producto.prdtoimagen)}
        />
      )
    },
  },
  {
    id: "categoria",
    accessorFn: (row) => `${row.categoria?.ctgnombre || ''} ${row.marca?.mrcnombre || ''}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoría / Marca" />
    ),
    cell: ({ row }) => {
      const producto = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm text-slate-700 dark:text-slate-300">{producto.categoria?.ctgnombre || 'S/C'}</span>
          <span className="text-xs text-muted-foreground">{producto.marca?.mrcnombre || 'S/M'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "prdtoprecioventa",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio" className="justify-end" />
    ),
    cell: ({ row }) => {
      const producto = row.original;
      return (
        <DataTablePriceCell
          price={producto.prdtoprecioventa}
          cost={producto.prdtopreciocompra}
        />
      )
    },
  },
  {
    accessorKey: "prdtostockmaximo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" className="justify-end" />
    ),
    cell: ({ row }) => {
      const producto = row.original;
      return (
        <DataTableStockCell
          stock={Number(producto.prdtostockmaximo)}
          minStock={Number(producto.prdtostockminimo)}
          unit={producto.medida?.mdiaabreviatura}
        />
      )
    },
  },
  {
    accessorKey: "prdtoestado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" className="justify-center" />
    ),
    cell: ({ row }) => (
      <div className="flex w-full justify-center">
        <DataTableStatusBadge status={row.original.prdtoestado} />
      </div>
    ),
  },
  {
    id: "actions",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" className="text-center w-full block" />
    ),
    cell: ({ row, table }) => {
      const producto = row.original;
      const meta = table.options.meta as ProductoTableMeta | undefined;

      if (!meta?.isJefe) return null;

      const actions: DataTableRowActionItem[] = [
        {
          label: "Editar producto",
          icon: <Pencil className="h-4 w-4" />,
          onClick: () => meta.onEdit(producto)
        }
      ];

      if (producto.prdtoestado === 'activo') {
        actions.push({
          label: "Marcar como inactivo",
          icon: <Ban className="h-4 w-4" />,
          onClick: () => meta.onStatusChange(producto, 'inactivo')
        });
      } else {
        actions.push({
          label: "Marcar como activo",
          icon: <CheckCircle className="h-4 w-4" />,
          onClick: () => meta.onStatusChange(producto, 'activo')
        });
      }

      actions.push({
        label: "Eliminar",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => meta.onStatusChange(producto, 'eliminado'),
        variant: 'danger',
        separatorAbove: true
      });

      return (
        <div className="flex justify-center">
          <DataTableRowActions actions={actions} />
        </div>
      )
    },
  },
]
