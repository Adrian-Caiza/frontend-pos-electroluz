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

export const UsuarioTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  const { data, isLoading } = useUsuarios(page, 1000); // Fetch all for local pagination/filtering if possible
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

  const handleStatusChange = (usuario: Usuario, newStatus: 'activo' | 'inactivo' | 'eliminado') => {
    if (!company?.emid) return;
    
    if (confirm(`¿Estás seguro de cambiar el estado de ${usuario.usnombre} a ${newStatus}?`)) {
      updateStatusMutation.mutate({
        id: usuario.usid,
        data: { 
          usemid: company.emid,
          usestado: newStatus 
        }
      });
    }
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

  // Filtrado local
  const filteredData = useMemo(() => {
    if (!data?.items) return [];
    let items = data.items.filter((u) => u.usestado !== 'eliminado');
    
    if (statusFilter !== 'todos') {
      items = items.filter((u) => u.usestado === statusFilter);
    }
    
    if (globalFilter) {
      const lowerQuery = globalFilter.toLowerCase();
      items = items.filter((u) => 
        u.usnombre.toLowerCase().includes(lowerQuery) || 
        u.usapodo.toLowerCase().includes(lowerQuery) ||
        u.uscorreo.toLowerCase().includes(lowerQuery)
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

  const meta: UsuarioTableMeta = {
    isJefe,
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
        getRowId={(row) => row.usid}
        toolbar={{
          globalFilter,
          onGlobalFilterChange: setGlobalFilter,
          searchPlaceholder: "Buscar por nombre, apodo o correo...",
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-background">
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
    </>
  );
};
