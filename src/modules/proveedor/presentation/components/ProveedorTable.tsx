import { useState, useMemo } from 'react';
import type { RowSelectionState } from '@tanstack/react-table';
import { useProveedores } from '../hooks/useProveedores';
import { useUpdateProveedor } from '../hooks/useUpdateProveedor';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { EditProveedorModal } from './EditProveedorModal';
import type { Proveedor } from '../../domain/entities/Proveedor';
import { DataTable } from '../../../../shared/components/ui/data-table/DataTable';
import { columns } from '../table/columns';
import type { ProveedorTableMeta } from '../table/columns';
import { CheckCircle, XCircle, Truck } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../shared/components/ui/select';
import { ConfirmDialog } from '../../../../shared/components/ui/modal/ConfirmDialog';

export const ProveedorTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  const { data, isLoading, error } = useProveedores(1, 1000);
  const updateMutation = useUpdateProveedor();
  const { mutate: updateProveedor } = updateMutation;
  const { user } = useAuthStore();
  const isJefeOrEmpleado = user?.usrol === 'jefe' || user?.usrol === 'empleado';

  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
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
    action: () => {},
  });

  const handleEdit = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    setIsEditModalOpen(true);
  };

  const handleStatusChange = (proveedor: Proveedor, newStatus: 'activo' | 'inactivo' | 'eliminado') => {
    let title = `¿Cambiar estado?`;
    let description = `¿Estás seguro de cambiar el estado de ${proveedor.provnombre} a ${newStatus}?`;
    
    if (newStatus === 'eliminado') {
      title = `¿Eliminar proveedor?`;
      description = `¿Estás seguro de eliminar el proveedor ${proveedor.provnombre}? Esta acción no se puede deshacer.`;
    }

    setConfirmDialog({
      isOpen: true,
      title,
      description,
      variant: newStatus === 'inactivo' ? 'warning' : newStatus === 'eliminado' ? 'destructive' : 'info',
      action: () => {
        updateProveedor({ id: proveedor.provid, data: { provestado: newStatus } }, {
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
        selectedIds.map(id => updateMutation.mutateAsync({ id, data: { provestado: newStatus } }))
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
    let items = data.items.filter(m => m.provestado !== 'eliminado'); // Ocultar eliminados por defecto
    
    if (statusFilter !== 'todos') {
      items = items.filter((m) => m.provestado === statusFilter);
    }
    
    if (globalFilter) {
      const lowerQuery = globalFilter.toLowerCase();
      items = items.filter((m) => 
        m.provnombre.toLowerCase().includes(lowerQuery) ||
        (m.provtelefono && m.provtelefono.toLowerCase().includes(lowerQuery)) ||
        (m.provcorreo && m.provcorreo.toLowerCase().includes(lowerQuery)) ||
        (m.categoria?.ctgnombre && m.categoria.ctgnombre.toLowerCase().includes(lowerQuery)) ||
        (m.marca?.mrcnombre && m.marca.mrcnombre.toLowerCase().includes(lowerQuery))
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

  const meta: ProveedorTableMeta = {
    isJefeOrEmpleado,
    onEdit: handleEdit,
    onStatusChange: handleStatusChange,
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-destructive space-y-4 bg-destructive/10 rounded-3xl p-8 border border-destructive/20">
        <Truck className="h-12 w-12" />
        <p className="text-lg font-medium">Error al cargar los proveedores</p>
      </div>
    );
  }

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
        getRowId={(row) => row.provid}
        toolbar={{
          globalFilter,
          onGlobalFilterChange: setGlobalFilter,
          searchPlaceholder: "Buscar por nombre, teléfono, correo o especialidad...",
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
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                    <SelectTrigger className="w-[180px] bg-card shadow-sm border-border">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los Estados</SelectItem>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )
        }}
      />

      <EditProveedorModal
        proveedor={selectedProveedor}
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
