import { useState } from 'react';
import { useSucursales } from '../hooks/useSucursales';
import { useUpdateSucursal } from '../hooks/useUpdateSucursal';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { EditSucursalModal } from './EditSucursalModal';
import type { Sucursal } from '../../domain/entities/Sucursal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import { Button } from '../../../../shared/components/ui/button';
import { MoreHorizontal, ShieldOff, CheckCircle2, Trash2, ArrowLeft, ArrowRight, Edit2 } from 'lucide-react';
import { Badge } from '../../../../shared/components/ui/badge';

export const SucursalTable = () => {
  const [page, setPage] = useState(1);
  const [editingSucursal, setEditingSucursal] = useState<Sucursal | null>(null);

  const { data, isLoading, isError } = useSucursales(page, 10);
  const { mutate: updateSucursal } = useUpdateSucursal();
  
  const { user } = useAuthStore();
  const isJefe = user?.usrol === 'jefe';

  if (isLoading) return <div className="p-4 text-center text-slate-500">Cargando sucursales...</div>;
  if (isError) return <div className="p-4 text-center text-red-500">Error al cargar las sucursales</div>;

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const handleStatusChange = (id: string, newStatus: 'activo' | 'inactivo' | 'eliminado') => {
    updateSucursal({ id, data: { suestado: newStatus } });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Identificador</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección / Correo</TableHead>
              <TableHead>Estado</TableHead>
              {isJefe && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isJefe ? 5 : 4} className="text-center h-24 text-slate-500">
                  No hay sucursales registradas en esta empresa.
                </TableCell>
              </TableRow>
            ) : (
              items.map((sucursal) => (
                <TableRow key={sucursal.suid}>
                  <TableCell className="font-medium text-slate-900">
                    ID: {sucursal.suidentificador}
                  </TableCell>
                  <TableCell className="text-slate-900 font-semibold">
                    {sucursal.sunombre}
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {sucursal.sudireccion ? <div>{sucursal.sudireccion}</div> : null}
                    {sucursal.sucorreo ? <div className="text-slate-400">{sucursal.sucorreo}</div> : null}
                    {!sucursal.sudireccion && !sucursal.sucorreo && <span className="text-slate-300">N/A</span>}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        sucursal.suestado === 'activo' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : sucursal.suestado === 'inactivo'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }
                    >
                      {sucursal.suestado}
                    </Badge>
                  </TableCell>
                  {isJefe && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingSucursal(sucursal)}>
                            <Edit2 className="mr-2 h-4 w-4 text-blue-600" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(sucursal.suid, 'activo')}
                            disabled={sucursal.suestado === 'activo' || sucursal.suestado === 'eliminado'}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />
                            <span>Marcar Activo</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleStatusChange(sucursal.suid, 'inactivo')}
                            disabled={sucursal.suestado === 'inactivo' || sucursal.suestado === 'eliminado'}
                          >
                            <ShieldOff className="mr-2 h-4 w-4 text-amber-600" />
                            <span>Marcar Inactivo</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(sucursal.suid, 'eliminado')}
                            disabled={sucursal.suestado === 'eliminado'}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Eliminar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Página {page} de {totalPages}
        </p>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
          >
            Siguiente <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Edit Modal Render */}
      {editingSucursal && (
        <EditSucursalModal
          sucursal={editingSucursal}
          open={!!editingSucursal}
          onOpenChange={(isOpen) => !isOpen && setEditingSucursal(null)}
        />
      )}
    </div>
  );
};
