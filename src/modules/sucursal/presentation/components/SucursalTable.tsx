import { useState, useMemo } from 'react';
import type { RowSelectionState } from '@tanstack/react-table';
import { useSucursales } from '../hooks/useSucursales';
import { useUpdateSucursal } from '../hooks/useUpdateSucursal';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { EditSucursalModal } from './EditSucursalModal';
import type { Sucursal } from '../../domain/entities/Sucursal';
import { DataTable } from '../../../../shared/components/ui/data-table/DataTable';
import { columns } from '../table/columns';
import type { SucursalTableMeta } from '../table/columns';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
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

export const SucursalTable = () => {
  const { page, setPage, pageSize, setPageSize, search, setSearch, status, setStatus, debouncedSearch } = useListFilters(10);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  const { data, isLoading } = useSucursales(page, pageSize, debouncedSearch, status); // Fetch all for local pagination/filtering
  const updateMutation = useUpdateSucursal();
  const { user } = useAuthStore();
  const isJefe = user?.usrol === 'jefe';

  const [editingSucursal, setEditingSucursal] = useState<Sucursal | null>(null);
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

  const handleEdit = (sucursal: Sucursal) => {
    setEditingSucursal(sucursal);
  };

  const handleStatusChange = (sucursal: Sucursal, newStatus: 'activo' | 'inactivo' | 'eliminado') => {
    setConfirmDialog({
      isOpen: true,
      title: `¿Cambiar estado?`,
      description: `¿Estás seguro de cambiar el estado de la sucursal ${sucursal.sunombre} a ${newStatus}?`,
      variant: newStatus === 'eliminado' ? 'destructive' : 'warning',
      action: () => {
        updateMutation.mutate({ id: sucursal.suid, data: { suestado: newStatus } }, {
          onSuccess: () => {
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          }
        });
      }
    });
  };

  const handleBulkAction = async (newStatus: 'activo' | 'inactivo' | 'eliminado') => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;

    setIsProcessingBulk(true);
    try {
      await Promise.all(
        selectedIds.map(id => updateMutation.mutateAsync({ id, data: { suestado: newStatus } }))
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

  const meta: SucursalTableMeta = {
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
        getRowId={(row) => row.suid}
        toolbar={{
          globalFilter: search,
          onGlobalFilterChange: setSearch,
          searchPlaceholder: "Buscar por nombre o identificador...",
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
                    variant="outline"
                    size="sm"
                    className="h-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    onClick={() => handleBulkAction('eliminado')}
                    disabled={isProcessingBulk}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
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

      {editingSucursal && (
        <EditSucursalModal
          sucursal={editingSucursal}
          open={!!editingSucursal}
          onOpenChange={(isOpen) => !isOpen && setEditingSucursal(null)}
        />
      )}
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
