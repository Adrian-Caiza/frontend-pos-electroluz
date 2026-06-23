import { useState } from 'react';
import type { RowSelectionState } from '@tanstack/react-table';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button';

import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { useListFilters } from '../../../../shared/hooks/useListFilters';
import { useProductos } from '../hooks/useProductos';
import { useUpdateProducto } from '../hooks/useUpdateProducto';
import { useProductoStore } from '../store/useProductoStore';
import type { Producto } from '../../domain/entities/Producto';
import { EditProductoModal } from './EditProductoModal';
import { DataTable } from '../../../../shared/components/ui/data-table/DataTable';
import { columns } from '../table/columns';
import type { ProductoTableMeta } from '../table/columns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../shared/components/ui/select';

export const ProductoTable = () => {
  const {
    page, setPage,
    pageSize, setPageSize,
    search, setSearch,
    status, setStatus,
    debouncedSearch
  } = useListFilters(10);

  // Server-side filtering
  const { data, isLoading } = useProductos(page, pageSize, debouncedSearch, status);
  const updateMutation = useUpdateProducto();
  const { user } = useAuthStore();
  const isAuthorized = user?.usrol === 'jefe' || user?.usrol === 'empleado';
  const { openDetail, selectedProduct } = useProductoStore();

  const [selectedProductoEdit, setSelectedProductoEdit] = useState<Producto | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Use server response data
  const tableData = data?.items || [];
  const totalItems = data?.totalItems || 0;
  const pageCount = data?.totalPages || 0;

  const handleStatusChange = (producto: Producto, newStatus: 'activo' | 'inactivo' | 'eliminado') => {
    updateMutation.mutate({
      id: producto.prdtoid,
      data: { prdtoestado: newStatus }
    });
  };

  const handleBulkAction = async (newStatus: 'activo' | 'inactivo' | 'eliminado') => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;

    setIsProcessingBulk(true);
    try {
      // Run updates in parallel
      await Promise.all(
        selectedIds.map(id => updateMutation.mutateAsync({ id, data: { prdtoestado: newStatus } }))
      );
      setRowSelection({});
    } catch (error) {
      console.error("Bulk update failed", error);
      // Let the mutation's onError handle the toast
    } finally {
      setIsProcessingBulk(false);
    }
  };

  const meta: ProductoTableMeta = {
    isJefe: isAuthorized,
    onEdit: (producto) => {
      setSelectedProductoEdit(producto);
      setIsEditOpen(true);
    },
    onStatusChange: handleStatusChange
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={tableData}
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
        getRowId={(row) => row.prdtoid}
        meta={meta}
        onRowClick={(row) => openDetail(row.original)}
        selectedRowId={selectedProduct?.prdtoid}
        toolbar={{
          globalFilter: search,
          onGlobalFilterChange: setSearch,
          searchPlaceholder: "Buscar por código o nombre...",
          onAdvancedFilterClick: () => {}, // Adding this will render the "Filtros" button
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

      <EditProductoModal
        producto={selectedProductoEdit}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
};
