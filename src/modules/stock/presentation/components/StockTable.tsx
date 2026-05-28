import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../shared/components/ui/table';
import { Badge } from '../../../../shared/components/ui/badge';
import { Button } from '../../../../shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, PackageCheck, PackageX, Trash2, Tag, Calendar } from 'lucide-react';
import { useStocks } from '../hooks/useStocks';
import { useUpdateStock } from '../hooks/useUpdateStock';
import { EditStockModal } from './EditStockModal';
import type { Stock } from '../../domain/entities/Stock';

interface StockTableProps {
  sucursalId: string;
}

export const StockTable = ({ sucursalId }: StockTableProps) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  // Consultamos stocks enviando `stcksuid`. El primer argumento (`suidentificador`) va undefined.
  const { data, isLoading } = useStocks(undefined, sucursalId, page, pageSize);
  const { mutate: updateStock } = useUpdateStock();

  const [stockToEdit, setStockToEdit] = useState<Stock | null>(null);

  const handleStatusChange = (stock: Stock, newStatus: 'activo' | 'inactivo' | 'eliminado') => {
    if (confirm(`¿Estás seguro de marcar el stock de ${stock.producto.prdtonombre} como ${newStatus}?`)) {
      updateStock({ id: stock.stckid, data: { stcksuid: sucursalId, stckestado: newStatus } });
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-slate-500">Cargando inventario...</div>;
  }

  const visibleStocks = data?.items.filter((s) => s.stckestado !== 'eliminado') || [];

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-semibold text-slate-700">Producto</TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">Cantidad Mínima</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Existencias</TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">Estado</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleStocks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  No hay existencias registradas en esta sucursal.
                </TableCell>
              </TableRow>
            ) : (
              visibleStocks.map((stock) => (
                <TableRow key={stock.stckid} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{stock.producto.prdtonombre}</span>
                      <span className="text-xs text-slate-500 mt-1 flex items-center">
                        <Tag className="w-3 h-3 mr-1" />
                        Código: {stock.producto.prdtocodigo}
                      </span>
                    </div>
                  </TableCell>
                  
                  {/* Aquí podría ir un "stock mínimo" si el producto lo tuviera, lo simulamos/dejamos genérico por ahora */}
                  <TableCell className="text-center text-slate-500">
                    N/A
                  </TableCell>

                  <TableCell className="text-right">
                    <span className={`text-lg font-bold ${Number(stock.stckcantidad) <= 10 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {Number(stock.stckcantidad)}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant={stock.stckestado === 'activo' ? 'default' : 'secondary'}
                      className={
                        stock.stckestado === 'activo'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }
                    >
                      {stock.stckestado === 'activo' ? 'Disponible' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Acciones de Bodega</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setStockToEdit(stock)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Ajustar cantidad
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {stock.stckestado === 'activo' ? (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(stock, 'inactivo')}
                            className="text-amber-600"
                          >
                            <PackageX className="mr-2 h-4 w-4" />
                            Bloquear lote (inactivo)
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(stock, 'activo')}
                            className="text-emerald-600"
                          >
                            <PackageCheck className="mr-2 h-4 w-4" />
                            Liberar lote (activo)
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(stock, 'eliminado')}
                          className="text-rose-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Dar de baja
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
          <div className="text-sm text-slate-500">
            Mostrando página {page} de {data.totalPages} ({data.totalItems} registros)
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === data.totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {stockToEdit && (
        <EditStockModal
          stock={stockToEdit}
          open={!!stockToEdit}
          onOpenChange={(open) => !open && setStockToEdit(null)}
        />
      )}
    </div>
  );
};
