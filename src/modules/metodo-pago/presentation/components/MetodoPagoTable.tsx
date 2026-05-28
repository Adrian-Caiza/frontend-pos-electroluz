import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Wallet, MoreHorizontal, Pencil } from 'lucide-react';
import { useMetodosPago } from '../hooks/useMetodosPago';
import { EditMetodoPagoModal } from './EditMetodoPagoModal';
import type { MetodoPago } from '../../domain/MetodoPago';
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

export const MetodoPagoTable = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMetodosPago(page, 10);
  
  const [selectedMetodo, setSelectedMetodo] = useState<MetodoPago | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (metodo: MetodoPago) => {
    setSelectedMetodo(metodo);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const metodos = data?.items || [];

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700">Nombre del Método</TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">Estado</TableHead>
              <TableHead className="font-semibold text-slate-700">Fecha Registro</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metodos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                  No hay métodos de pago registrados.
                </TableCell>
              </TableRow>
            ) : (
              metodos.map((metodo) => (
                <TableRow key={metodo.mpid} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3 text-indigo-600">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-slate-900">{metodo.mpnombre}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        metodo.mpestado === 'activo'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {metodo.mpestado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>

                  <TableCell className="text-slate-500 text-sm">
                    {format(new Date(metodo.mpfchregistro), "d 'de' MMMM, yyyy", { locale: es })}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(metodo)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Actualizar / Cambiar Estado</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <Button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
              >
                Anterior
              </Button>
              <Button
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                variant="outline"
              >
                Siguiente
              </Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-700">
                  Mostrando página <span className="font-medium">{page}</span> de{' '}
                  <span className="font-medium">{data.totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <Button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    variant="outline"
                    className="rounded-l-md rounded-r-none"
                  >
                    Anterior
                  </Button>
                  <Button
                    onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                    disabled={page === data.totalPages}
                    variant="outline"
                    className="rounded-r-md rounded-l-none"
                  >
                    Siguiente
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      <EditMetodoPagoModal
        metodoPago={selectedMetodo}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
    </>
  );
};
