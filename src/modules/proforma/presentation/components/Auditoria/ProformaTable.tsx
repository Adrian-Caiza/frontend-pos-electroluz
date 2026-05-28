import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Receipt, Search, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { useProformas } from '../../hooks/useProformas';
import { useCancelProforma } from '../../hooks/useCancelProforma';
import { usePayProforma } from '../../hooks/usePayProforma';
import type { Proforma } from '../../../domain/Proforma';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../../shared/components/ui/table';
import { Button } from '../../../../../shared/components/ui/button';

export const ProformaTable = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProformas(page, 10);
  const { mutateAsync: cancelProforma, isPending: isCanceling } = useCancelProforma();
  const { mutateAsync: payProforma, isPending: isPaying } = usePayProforma();

  const handleCancel = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas CANCELAR esta proforma? Esta acción devolverá el inventario a bodega.')) {
      await cancelProforma(id);
    }
  };

  const handlePay = async (id: string) => {
    if (window.confirm('¿Confirmas el PAGO de esta proforma? Se marcará como completada.')) {
      await payProforma(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const proformas = data?.items || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold text-slate-700">Comprobante</TableHead>
            <TableHead className="font-semibold text-slate-700">Cliente</TableHead>
            <TableHead className="font-semibold text-slate-700">Método de Pago</TableHead>
            <TableHead className="font-semibold text-slate-700 text-center">Estado</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">Total</TableHead>
            <TableHead className="text-right font-semibold text-slate-700">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proformas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                No hay transacciones registradas.
              </TableCell>
            </TableRow>
          ) : (
            proformas.map((proforma) => (
              <TableRow key={proforma.prfmaid} className="hover:bg-slate-50">
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 text-slate-600">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{proforma.prfmaidentificador}</span>
                      <span className="text-xs text-slate-500">
                        {format(new Date(proforma.prfmafchregistro), "d MMM yyyy, HH:mm", { locale: es })}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{proforma.receptor.clntenombre}</span>
                    <span className="text-xs text-slate-500">CI/RUC: {proforma.receptor.clnteidentificacion}</span>
                  </div>
                </TableCell>

                <TableCell className="text-slate-600 text-sm">
                  {proforma.metodoPago.mpnombre}
                </TableCell>
                
                <TableCell className="text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      proforma.prfmaestado === 'pagada'
                        ? 'bg-emerald-100 text-emerald-800'
                        : proforma.prfmaestado === 'cancelada'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800' // emitida
                    }`}
                  >
                    {proforma.prfmaestado.charAt(0).toUpperCase() + proforma.prfmaestado.slice(1)}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <span className="font-bold text-slate-900">
                    ${proforma.total.prfmatotal.toFixed(2)}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  {proforma.prfmaestado === 'emitida' && (
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(proforma.prfmaid)}
                        disabled={isCanceling || isPaying}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                        title="Cancelar Proforma"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handlePay(proforma.prfmaid)}
                        disabled={isCanceling || isPaying}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        title="Registrar Pago"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {proforma.prfmaestado !== 'emitida' && (
                    <span className="text-xs text-slate-400 italic">Sin acciones</span>
                  )}
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
  );
};
