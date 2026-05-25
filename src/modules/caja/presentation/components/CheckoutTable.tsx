import { useState } from 'react';
import { useCheckouts } from '../hooks/useCheckouts';
import { useUpdateCheckoutStatus } from '../hooks/useUpdateCheckoutStatus';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import { Button } from '../../../../shared/components/ui/button';
import { MoreHorizontal, ShieldOff, CheckCircle2, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Badge } from '../../../../shared/components/ui/badge';

export const CheckoutTable = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useCheckouts(page, 10);
  const { mutate: updateStatus } = useUpdateCheckoutStatus();
  const { user } = useAuthStore();
  const isJefe = user?.usrol === 'jefe';

  if (isLoading) return <div className="p-4 text-center text-slate-500">Cargando cajas...</div>;
  if (isError) return <div className="p-4 text-center text-red-500">Error al cargar las cajas</div>;

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const handleStatusChange = (id: string, newStatus: 'activo' | 'inactivo' | 'eliminado') => {
    updateStatus({ id, data: { cjestado: newStatus } });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Identificador</TableHead>
              <TableHead>Sucursal</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Registro</TableHead>
              {isJefe && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isJefe ? 5 : 4} className="text-center h-24 text-slate-500">
                  No hay cajas registradas.
                </TableCell>
              </TableRow>
            ) : (
              items.map((checkout) => (
                <TableRow key={checkout.cjid}>
                  <TableCell className="font-medium text-slate-900">
                    Caja {checkout.cjidentificador}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {checkout.sucursal?.sunombre || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        checkout.cjestado === 'activo' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : checkout.cjestado === 'inactivo'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }
                    >
                      {checkout.cjestado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {new Date(checkout.cjfchregistro).toLocaleDateString()}
                  </TableCell>
                  {isJefe && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(checkout.cjid, 'activo')}
                            disabled={checkout.cjestado === 'activo' || checkout.cjestado === 'eliminado'}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />
                            <span>Marcar Activo</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(checkout.cjid, 'inactivo')}
                            disabled={checkout.cjestado === 'inactivo' || checkout.cjestado === 'eliminado'}
                          >
                            <ShieldOff className="mr-2 h-4 w-4 text-amber-600" />
                            <span>Marcar Inactivo</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(checkout.cjid, 'eliminado')}
                            disabled={checkout.cjestado === 'eliminado'}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Eliminar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Página {page} de {totalPages}
        </p>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
          >
            Siguiente <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
