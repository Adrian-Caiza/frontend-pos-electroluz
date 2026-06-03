import { useState, useMemo } from 'react';
import type { RowSelectionState } from '@tanstack/react-table';
import { useStocks } from '../hooks/useStocks';
import { useUpdateStock } from '../hooks/useUpdateStock';
import { EditStockModal } from './EditStockModal';
import type { Stock } from '../../domain/entities/Stock';
import { DataTable } from '../../../../shared/components/ui/data-table/DataTable';
import { columns } from '../table/columns';
import type { StockTableMeta } from '../table/columns';
import { PackageCheck, PackageX, Trash2 } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../shared/components/ui/select';
import { ConfirmDialog } from '../../../../shared/components/ui/modal/ConfirmDialog';

interface StockTableProps {
  sucursalId: string;
}

export const StockTable = ({ sucursalId }: StockTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Fetch all for local pagination/filtering if possible
  const { data, isLoading } = useStocks(undefined, sucursalId, page, 1000);
  const { mutate: updateStock, mutateAsync: updateStockAsync } = useUpdateStock();

  const [stockToEdit, setStockToEdit] = useState<Stock | null>(null);
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
    action: () => {},
  });

  const handleEdit = (stock: Stock) => {
    setStockToEdit(stock);
  };

  const handleStatusChange = (stock: Stock, newStatus: 'activo' | 'inactivo' | 'eliminado') => {
    setConfirmDialog({
      isOpen: true,
      title: `¿Cambiar estado?`,
      description: `¿Estás seguro de marcar el stock de ${stock.producto.prdtonombre} como ${newStatus}?`,
      variant: newStatus === 'eliminado' ? 'destructive' : 'warning',
      action: () => {
        updateStock({ id: stock.stckid, data: { stcksuid: sucursalId, stckestado: newStatus } }, {
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
        selectedIds.map(id => updateStockAsync({ id, data: { stcksuid: sucursalId, stckestado: newStatus } }))
      );
      setRowSelection({});
    } catch (error) {
      console.error("Bulk update failed", error);
    } finally {
      setIsProcessingBulk(false);
    }
  };

  // Filtrado local
  const filteredData = useMemo(() => {
    if (!data?.items) return [];
    let items = data.items.filter((s) => s.stckestado !== 'eliminado');
    
    if (statusFilter !== 'todos') {
      items = items.filter((s) => s.stckestado === statusFilter);
    }
    
    if (globalFilter) {
      const lowerQuery = globalFilter.toLowerCase();
      items = items.filter((s) => 
        s.producto.prdtonombre.toLowerCase().includes(lowerQuery) || 
        s.producto.prdtocodigo.toLowerCase().includes(lowerQuery)
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

  const meta: StockTableMeta = {
    sucursalId,
    onEdit: handleEdit,
    onStatusChange: handleStatusChange,
  };

  return (
    <>
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
        getRowId={(row) => row.stckid}
        toolbar={{
          globalFilter,
          onGlobalFilterChange: setGlobalFilter,
          searchPlaceholder: "Buscar por nombre de producto o código...",
          onAdvancedFilterClick: () => {},
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
                    <PackageCheck className="mr-2 h-4 w-4" />
                    Activar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-9 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    onClick={() => handleBulkAction('inactivo')}
                    disabled={isProcessingBulk}
                  >
                    <PackageX className="mr-2 h-4 w-4" />
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
                    Dar de baja
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los Estados</SelectItem>
                    <SelectItem value="activo">Disponible</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )
        }}
      />

      {stockToEdit && (
        <EditStockModal
          stock={stockToEdit}
          open={!!stockToEdit}
          onOpenChange={(open) => !open && setStockToEdit(null)}
        />
      )}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        isLoading={false} // useUpdateStock doesn't easily expose isPending for the non-async version in this component structure unless we use mutateAsync or extract it, but it's quick.
      />
    </>
  );
};
