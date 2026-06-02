import { useState, useMemo } from 'react';
import type { RowSelectionState } from '@tanstack/react-table';
import { useProformas } from '../../hooks/useProformas';
import { useCancelProforma } from '../../hooks/useCancelProforma';
import { usePayProforma } from '../../hooks/usePayProforma';
import { DataTable } from '../../../../../shared/components/ui/data-table/DataTable';
import { columns } from '../../table/columns';
import type { ProformaTableMeta } from '../../table/columns';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../../../../../shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../shared/components/ui/select';

export const ProformaTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data, isLoading } = useProformas(page, 1000); // Fetch all for local filtering
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

  const handleBulkAction = async (action: 'cancelar' | 'pagar') => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;

    if (action === 'cancelar' && !window.confirm(`¿Estás seguro de CANCELAR ${selectedIds.length} proformas?`)) return;
    if (action === 'pagar' && !window.confirm(`¿Confirmas el PAGO de ${selectedIds.length} proformas?`)) return;

    setIsProcessingBulk(true);
    try {
      await Promise.all(
        selectedIds.map(id => action === 'cancelar' ? cancelProforma(id) : payProforma(id))
      );
      setRowSelection({});
    } catch (error) {
      console.error("Bulk action failed", error);
    } finally {
      setIsProcessingBulk(false);
    }
  };

  // Filtrado local
  const filteredData = useMemo(() => {
    if (!data?.items) return [];
    let items = data.items;
    
    if (statusFilter !== 'todos') {
      items = items.filter((p) => p.prfmaestado === statusFilter);
    }
    
    if (globalFilter) {
      const lowerQuery = globalFilter.toLowerCase();
      items = items.filter((p) => 
        p.prfmaidentificador.toLowerCase().includes(lowerQuery) || 
        p.receptor.clntenombre.toLowerCase().includes(lowerQuery) ||
        p.receptor.clnteidentificacion.toLowerCase().includes(lowerQuery)
      );
    }
    
    return items;
  }, [data?.items, globalFilter, statusFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, page, pageSize]);

  const totalFilteredItems = filteredData.length;
  const pageCount = Math.ceil(totalFilteredItems / pageSize);

  const meta: ProformaTableMeta = {
    onCancel: handleCancel,
    onPay: handlePay,
    isCanceling,
    isPaying,
  };

  return (
    <DataTable
      columns={columns}
      data={paginatedData}
      meta={meta}
      isLoading={isLoading}
      pageCount={pageCount}
      rowCount={totalFilteredItems}
      pagination={{ pageIndex: page - 1, pageSize }}
      onPaginationChange={(newPagination) => {
        setPage(newPagination.pageIndex + 1);
        setPageSize(newPagination.pageSize);
      }}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      getRowId={(row) => row.prfmaid}
      toolbar={{
        globalFilter,
        onGlobalFilterChange: setGlobalFilter,
        searchPlaceholder: "Buscar por comprobante, cliente o CI/RUC...",
        onAdvancedFilterClick: () => {},
        children: (
          <div className="flex gap-2">
            {Object.keys(rowSelection).length > 0 ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-9 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  onClick={() => handleBulkAction('pagar')}
                  disabled={isProcessingBulk || isCanceling || isPaying}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Pagar Seleccionadas
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  onClick={() => handleBulkAction('cancelar')}
                  disabled={isProcessingBulk || isCanceling || isPaying}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancelar Seleccionadas
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 text-slate-500 hover:text-slate-700"
                  onClick={() => setRowSelection({})}
                  disabled={isProcessingBulk || isCanceling || isPaying}
                >
                  Deseleccionar
                </Button>
              </>
            ) : (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los Estados</SelectItem>
                  <SelectItem value="emitida">Emitida</SelectItem>
                  <SelectItem value="pagada">Pagada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )
      }}
    />
  );
};
