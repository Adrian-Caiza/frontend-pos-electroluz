import { useState, useMemo } from 'react';
import type { RowSelectionState } from '@tanstack/react-table';
import { useUsuarios } from '../hooks/useUsuarios';
import { useUpdateUsuarioStatus } from '../hooks/useUpdateUsuarioStatus';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import type { Usuario } from '../../domain/entities/Usuario';
import { EditUsuarioModal } from './EditUsuarioModal';
import { DataTable } from '../../../../shared/components/ui/data-table/DataTable';
import { columns } from '../table/columns';
import type { UsuarioTableMeta } from '../table/columns';
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

export const UsuarioTable = () => {
  const { page, setPage, pageSize, setPageSize, search, setSearch, status, setStatus, debouncedSearch } = useListFilters(10);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  const { data, isLoading } = useUsuarios(page, pageSize, debouncedSearch, status); // Fetch all for local pagination/filtering if possible
  const updateStatusMutation = useUpdateUsuarioStatus();
  const { user: currentUser, company } = useAuthStore();
  const isJefe = currentUser?.usrol === 'jefe';

  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsEditOpen(true);
  };

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

  const handleStatusChange = (usuario: Usuario, newStatus: 'activo' | 'inactivo' | 'eliminado') => {
    if (!company?.emid) return;

    setConfirmDialog({
      isOpen: true,
      title: `¿Cambiar estado?`,
      description: `¿Estás seguro de cambiar el estado de ${usuario.usnombre} a ${newStatus}?`,
      variant: newStatus === 'eliminado' ? 'destructive' : 'warning',
      action: () => {
        updateStatusMutation.mutate({
          id: usuario.usid,
          data: {
            usemid: company.emid,
            usestado: newStatus
          }
        }, {
          onSuccess: () => {
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          }
        });
      }
    });
  };

  const handleBulkAction = async (newStatus: 'activo' | 'inactivo' | 'eliminado') => {
    if (!company?.emid) return;

    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;

    setIsProcessingBulk(true);
    try {
      await Promise.all(
        selectedIds.map(id =>
          updateStatusMutation.mutateAsync({
            id,
            data: {
              usemid: company.emid,
              usestado: newStatus
            }
          })
        )
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

  const meta: UsuarioTableMeta = {
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
        getRowId={(row) => row.usid}
        toolbar={{
          globalFilter: search,
          onGlobalFilterChange: setSearch,
          searchPlaceholder: "Buscar por nombre, apodo o correo...",
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

      <EditUsuarioModal
        usuario={selectedUsuario}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        isLoading={updateStatusMutation.isPending}
      />
    </>
  );
};
