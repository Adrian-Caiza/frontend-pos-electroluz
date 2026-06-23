import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RowSelectionState } from '@tanstack/react-table';
import { useProformas } from '../../hooks/useProformas';
import { useCancelProforma } from '../../hooks/useCancelProforma';
import { usePayProforma } from '../../hooks/usePayProforma';
import { useProformaPdf } from '../../hooks/useProformaPdf';
import { useSendProforma } from '../../hooks/useSendProforma';
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
import { ConfirmDialog } from '../../../../../shared/components/ui/modal/ConfirmDialog';
import { useListFilters } from '../../../../../shared/hooks/useListFilters';

export const ProformaTable = () => {
  const navigate = useNavigate();
  const { page, setPage, pageSize, setPageSize, search, setSearch, status, setStatus, debouncedSearch } = useListFilters(10);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data, isLoading } = useProformas(page, pageSize, debouncedSearch, status);
  const { mutateAsync: cancelProforma, isPending: isCanceling } = useCancelProforma();
  const { mutateAsync: payProforma, isPending: isPaying } = usePayProforma();
  const { mutate: viewPdf, isPending: isViewingPdf } = useProformaPdf();
  const { mutate: sendProforma, isPending: isSending } = useSendProforma();

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    variant: 'default' | 'destructive' | 'warning' | 'info';
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    variant: 'default',
    action: () => { },
  });

  const handleCancel = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: '¿Cancelar Proforma?',
      description: '¿Estás seguro de que deseas CANCELAR esta proforma? Esta acción devolverá el inventario a bodega.',
      variant: 'destructive',
      action: async () => {
        await cancelProforma(id);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handlePay = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: '¿Pagar Proforma?',
      description: '¿Confirmas el PAGO de esta proforma? Se marcará como completada.',
      variant: 'info',
      action: async () => {
        await payProforma(id);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleBulkAction = async (action: 'cancelar' | 'pagar') => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;

    setConfirmDialog({
      isOpen: true,
      title: action === 'cancelar' ? '¿Cancelar Proformas?' : '¿Pagar Proformas?',
      description: action === 'cancelar'
        ? `¿Estás seguro de CANCELAR ${selectedIds.length} proformas?`
        : `¿Confirmas el PAGO de ${selectedIds.length} proformas?`,
      variant: action === 'cancelar' ? 'destructive' : 'info',
      action: async () => {
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
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

    

  

  
  const tableData = data?.items || [];
  const totalItems = data?.totalItems || 0;
  const pageCount = data?.totalPages || 0;

  const meta: ProformaTableMeta = {
    onCancel: handleCancel,
    onPay: handlePay,
    onEdit: (id: string) => navigate(`/terminal?edit=${id}`),
    onViewPdf: (id: string) => viewPdf(id),
    onSend: (id: string, channel: 'email' | 'whatsapp') => sendProforma({ id, channel }),
    isCanceling,
    isPaying,
    isSending,
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={tableData}
        meta={meta}
        isLoading={isLoading}
        pageCount={pageCount}
        rowCount={totalItems}
        pagination={{ pageIndex: page - 1, pageSize }}
        onPaginationChange={(newPagination) => {
          setPage(newPagination.pageIndex + 1);
          setPageSize(newPagination.pageSize);
        }}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        getRowId={(row) => row.prfmaid}
        toolbar={{
          globalFilter: search,
          onGlobalFilterChange: setSearch,
          searchPlaceholder: "Buscar por comprobante, cliente o CI/RUC...",
          onAdvancedFilterClick: () => { },
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
                <Select value={status ?? 'todos'} onValueChange={(v) => setStatus(v === 'todos' ? undefined : v)}>
                  <SelectTrigger className="w-[180px] bg-card shadow-sm border-border">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los Estados</SelectItem>
                    <SelectItem value="emitida">Emitida</SelectItem>
                    <SelectItem value="pagada">Pagada</SelectItem>
                    <SelectItem value="anulada">Anulada</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )
        }}
      />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        isLoading={isCanceling || isPaying || isProcessingBulk}
      />
    </>
  );
};
