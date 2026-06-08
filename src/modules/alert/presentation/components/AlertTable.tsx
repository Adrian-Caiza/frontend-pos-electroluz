import { useState } from 'react';
import type { RowSelectionState } from '@tanstack/react-table';
import { useAlerts } from '../hooks/useAlerts';
import { useMarkAlertAsViewed } from '../hooks/useMarkAlertAsViewed';
import { useAlertStore } from '../store/useAlertStore';
import { useSucursales } from '../../../sucursal/presentation/hooks/useSucursales';
import { DataTable } from '../../../../shared/components/ui/data-table/DataTable';
import { columns } from '../table/columns';
import type { AlertTableMeta } from '../table/columns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../shared/components/ui/select';

export const AlertTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState(''); // Not used heavily by backend right now, but standard for UI
  const [suidFilter, setSuidFilter] = useState('todas');
  
  const selectedSuid = suidFilter === 'todas' ? undefined : suidFilter;
  
  const { data, isLoading } = useAlerts(page, pageSize, selectedSuid);
  const { data: sucursalesData } = useSucursales(1, 100); // fetch all for filter
  
  const { mutate: markAsViewed } = useMarkAlertAsViewed();
  const { removeUnreadAlert } = useAlertStore();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const handleMarkAsViewed = (id: string) => {
    markAsViewed(id, {
      onSuccess: () => {
        removeUnreadAlert(id);
      }
    });
  };

  const meta: AlertTableMeta = {
    onMarkAsViewed: handleMarkAsViewed,
  };

  return (
    <DataTable
      columns={columns}
      data={data?.items || []}
      meta={meta}
      isLoading={isLoading}
      pageCount={data?.totalPages || 0}
      rowCount={data?.totalItems || 0}
      pagination={{ pageIndex: page - 1, pageSize }}
      onPaginationChange={(newPagination) => {
        setPage(newPagination.pageIndex + 1);
        setPageSize(newPagination.pageSize);
      }}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      getRowId={(row) => row.alid}
      toolbar={{
        globalFilter,
        onGlobalFilterChange: setGlobalFilter,
        searchPlaceholder: "Buscar alertas...", // Si el backend no soporta busqueda libre, esto solo filtrará localmente si el DataTable lo hace
        onAdvancedFilterClick: () => {},
        children: (
          <div className="flex gap-2">
            <Select value={suidFilter} onValueChange={(val) => { setSuidFilter(val); setPage(1); }}>
              <SelectTrigger className="w-[200px] bg-background">
                <SelectValue placeholder="Sucursal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las Sucursales</SelectItem>
                {sucursalesData?.items.map((sucursal) => (
                  <SelectItem key={sucursal.suid} value={sucursal.suid}>
                    {sucursal.sunombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      }}
    />
  );
};
