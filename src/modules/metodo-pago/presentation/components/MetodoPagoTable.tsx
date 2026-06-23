import { useState, useMemo } from 'react';
import type { RowSelectionState } from '@tanstack/react-table';
import { useMetodosPago } from '../hooks/useMetodosPago';
import { useUpdateMetodoPago } from '../hooks/useUpdateMetodoPago';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { EditMetodoPagoModal } from './EditMetodoPagoModal';
import type { MetodoPago } from '../../domain/MetodoPago';
import { DataTable } from '../../../../shared/components/ui/data-table/DataTable';
import { columns } from '../table/columns';
import type { MetodoPagoTableMeta } from '../table/columns';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../shared/components/ui/select';
import { ConfirmDialog } from '../../../../shared/components/ui/modal/ConfirmDialog';
import { useListFilters } from '../../../../shared/hooks/useListFilters';

export const MetodoPagoTable = () => {
  const { page, setPage, pageSize, setPageSize, search, setSearch, status, setStatus, debouncedSearch } = useListFilters(10);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  const { data, isLoading } = useMetodosPago(page, pageSize, debouncedSearch, status);
  const updateMutation = useUpdateMetodoPago();
  const { mutate: updateMetodo } = updateMutation;
  const { user } = useAuthStore();
  const isJefe = user?.usrol === 'jefe';

  const [selectedMetodo, setSelectedMetodo] = useState<MetodoPago | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

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

  const handleEdit = (metodo: MetodoPago) => {
    setSelectedMetodo(metodo);
    setIsEditModalOpen(true);
  };

  const handleStatusChange = (metodo: MetodoPago, newStatus: 'activo' | 'inactivo') => {
    setConfirmDialog({
      isOpen: true,
      title: `¿Cambiar estado?`,
      description: `¿Estás seguro de cambiar el estado de ${metodo.mpnombre} a ${newStatus}?`,
      variant: newStatus === 'inactivo' ? 'warning' : 'info',
      action: () => {
        updateMetodo({ id: metodo.mpid, data: { mpestado: newStatus } }, {
          onSuccess: () => {
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          }
        });
      }
    });
  };

  const handleBulkAction = async (newStatus: 'activo' | 'inactivo') => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;

    setIsProcessingBulk(true);
    try {
      await Promise.all(
        selectedIds.map(id => updateMutation.mutateAsync({ id, data: { mpestado: newStatus } }))
      );
      setRowSelection({});
    } catch (error) {
      console.error("Bulk update failed", error);
    } finally {
      setIsProcessingBulk(false);
    }
  };

    

  

  
  const tableData = data?.items || [];
  const totalItems = data?.totalItems || 0;
  const pageCount = data?.totalPages || 0;

  const meta: MetodoPagoTableMeta = {
    isJefe,
    onEdit: handleEdit,
    onStatusChange: handleStatusChange,
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
        getRowId={(row) => row.mpid}
        toolbar={{
          globalFilter: search,
          onGlobalFilterChange: setSearch,
          searchPlaceholder: "Buscar por nombre del método...",
          onAdvancedFilterClick: () => { },
          children: (
            <div className="flex gap-2">
              {Object.keys(rowSelection).length > 0 ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    onClick={() => handleBulkAction('activo')}
                    disabled={isProcessingBulk}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    onClick={() => handleBulkAction('inactivo')}
                    disabled={isProcessingBulk}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Inactivar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 text-slate-500 hover:text-slate-700"
                    onClick={() => setRowSelection({})}
                    disabled={isProcessingBulk}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <Select value={status ?? 'todos'} onValueChange={(v) => setStatus(v === 'todos' ? undefined : v)}>
                  <SelectTrigger className="w-[180px] bg-card shadow-sm border-border">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los Estados</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )
        }}
      />

      <EditMetodoPagoModal
        metodoPago={selectedMetodo}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        isLoading={updateMutation.isPending}
      />
    </>
  );
};
