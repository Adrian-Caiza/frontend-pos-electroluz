import { useState, useMemo } from 'react';

import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { useProductos } from '../hooks/useProductos';
import { useUpdateProducto } from '../hooks/useUpdateProducto';
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  // Fetch all products since we are doing client-side filtering
  const { data, isLoading } = useProductos(1, 10000);
  const updateMutation = useUpdateProducto();
  const { user } = useAuthStore();
  const isJefe = user?.usrol === 'jefe';

  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Client-side filtering of the current page data (since API doesn't support it yet)
  const filteredData = useMemo(() => {
    if (!data?.items) return [];
    let items = data.items.filter((p) => p.prdtoestado !== 'eliminado');
    
    if (statusFilter !== 'todos') {
      items = items.filter((p) => p.prdtoestado === statusFilter);
    }
    
    if (globalFilter) {
      const lowerQuery = globalFilter.toLowerCase();
      items = items.filter((p) => 
        p.prdtonombre.toLowerCase().includes(lowerQuery) || 
        p.prdtocodigo.toLowerCase().includes(lowerQuery) ||
        p.categoria?.ctgnombre.toLowerCase().includes(lowerQuery) ||
        p.marca?.mrcnombre.toLowerCase().includes(lowerQuery)
      );
    }
    
    return items;
  }, [data?.items, statusFilter, globalFilter]);

  // Handle pagination locally from the filtered dataset
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, page, pageSize]);

  const totalFilteredItems = filteredData.length;
  const pageCount = Math.ceil(totalFilteredItems / pageSize);

  const handleStatusChange = (producto: Producto, newStatus: 'activo' | 'inactivo' | 'eliminado') => {
    updateMutation.mutate({
      id: producto.prdtoid,
      data: { prdtoestado: newStatus }
    });
  };

  const meta: ProductoTableMeta = {
    isJefe,
    onEdit: (producto) => {
      setSelectedProducto(producto);
      setIsEditOpen(true);
    },
    onStatusChange: handleStatusChange
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={paginatedData}
        isLoading={isLoading}
        pageCount={pageCount}
        rowCount={totalFilteredItems}
        pagination={{ pageIndex: page - 1, pageSize }}
        onPaginationChange={(newPagination) => {
          setPage(newPagination.pageIndex + 1);
          setPageSize(newPagination.pageSize);
        }}
        meta={meta}
        toolbar={{
          globalFilter,
          onGlobalFilterChange: setGlobalFilter,
          searchPlaceholder: "Buscar por nombre, código, categoría o marca...",
          onAdvancedFilterClick: () => {}, // Adding this will render the "Filtros" button
          children: (
            <div className="flex gap-2">
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
            </div>
          )
        }}
      />

      <EditProductoModal
        producto={selectedProducto}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
};
