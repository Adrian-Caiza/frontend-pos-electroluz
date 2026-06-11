import type { ColumnDef } from '@tanstack/react-table';
import type { Stock } from '../../domain/entities/Stock';
import { DataTableColumnHeader } from '../../../../shared/components/ui/data-table/DataTableColumnHeader';
import { DataTableCheckbox } from '../../../../shared/components/ui/data-table/DataTableCheckbox';
import { DataTableStatusBadge } from '../../../../shared/components/ui/data-table/DataTableStatusBadge';
import { DataTableRowActions, type DataTableRowActionItem } from '../../../../shared/components/ui/data-table/DataTableRowActions';
import { DataTableProductCell } from '../../../../shared/components/ui/data-table/DataTableProductCell';
import { DataTableRowIndicator } from '../../../../shared/components/ui/data-table/DataTableRowIndicator';
import { Edit, PackageCheck, PackageX, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Producto } from '../../../producto/domain/entities/Producto';
import { getImageUrl } from '../../../producto/presentation/table/columns';

export interface StockTableMeta {
  sucursalId: string;
  productos: Producto[];
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
    id: "codigo",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
    cell: ({ row }) => {
      const stock = row.original;
      return (
        <div className="flex items-center gap-3">
          <DataTableRowIndicator status={stock.stckestado} />
          <span className="text-sm font-medium text-slate-600">
            {stock.producto.prdtocodigo}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'producto',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Producto" />,
    cell: ({ row, table }) => {
      const stock = row.original;
      const meta = table.options.meta as StockTableMeta;
      const fullProduct = meta.productos?.find(p => p.prdtoid === stock.producto.prdtoid);
      
      return (
        <DataTableProductCell 
          name={stock.producto.prdtonombre}
          imageUrl={getImageUrl(fullProduct?.prdtoimagen || null)}
        />
      );
    },
  },
  {
    id: 'cantidadMinima',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cantidad Mínima" className="justify-center" />,
    cell: ({ row, table }) => {
      const stock = row.original;
      const meta = table.options.meta as StockTableMeta;
      const fullProduct = meta.productos?.find(p => p.prdtoid === stock.producto.prdtoid);
      const minStock = fullProduct?.prdtostockminimo ? Number(fullProduct.prdtostockminimo) : null;

      return (
        <div className="text-center text-slate-500 w-full font-medium">
          {minStock !== null ? minStock : 'N/A'}
        </div>
      );
    },
  },
  {
    accessorKey: 'stckcantidad',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" className="justify-end" />,
    cell: ({ row, table }) => {
      const stock = row.original;
      const meta = table.options.meta as StockTableMeta;
      const fullProduct = meta.productos?.find(p => p.prdtoid === stock.producto.prdtoid);
      const minStock = fullProduct?.prdtostockminimo ? Number(fullProduct.prdtostockminimo) : null;
      
      const isLowStock = minStock !== null ? Number(stock.stckcantidad) <= minStock : Number(stock.stckcantidad) <= 10;

      return (
        <div className="text-right w-full">
          <span className={`text-lg font-bold ${isLowStock ? 'text-rose-600' : 'text-slate-700'}`}>
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
