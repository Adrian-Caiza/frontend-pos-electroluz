import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../shared/components/ui/table';
import { Badge } from '../../../../shared/components/ui/badge';
import { Button } from '../../../../shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, UserCheck, UserMinus, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { useClientes } from '../hooks/useClientes';
import { useUpdateCliente } from '../hooks/useUpdateCliente';
import { EditClienteModal } from './EditClienteModal';
import type { Cliente } from '../../domain/entities/Cliente';

export const ClienteTable = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  const { data, isLoading } = useClientes(page, pageSize);
  const { mutate: updateCliente } = useUpdateCliente();

  const [clienteToEdit, setClienteToEdit] = useState<Cliente | null>(null);

  const handleStatusChange = (cliente: Cliente, newStatus: 'activo' | 'inactivo' | 'eliminado') => {
    if (confirm(`¿Estás seguro de marcar a ${cliente.clntenombre} como ${newStatus}?`)) {
      updateCliente({ id: cliente.clnteid, data: { clnteestado: newStatus } });
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-slate-500">Cargando clientes...</div>;
  }

  // Filtrar clientes eliminados visualmente si se desea, aunque la API ya podría filtrarlos
  // Si la API los retorna, los ocultamos aquí según requerimiento (opcional).
  const visibleClientes = data?.items.filter((c) => c.clnteestado !== 'eliminado') || [];

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-semibold text-slate-700">Cliente</TableHead>
              <TableHead className="font-semibold text-slate-700">Identificación</TableHead>
              <TableHead className="font-semibold text-slate-700">Contacto</TableHead>
              <TableHead className="font-semibold text-slate-700">Estado</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleClientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  No hay clientes registrados.
                </TableCell>
              </TableRow>
            ) : (
              visibleClientes.map((cliente) => (
                <TableRow key={cliente.clnteid} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{cliente.clntenombre}</span>
                      <span className="text-xs text-slate-500 mt-1 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {cliente.clntedireccion}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-700">{cliente.clnteidentificacion}</span>
                      <span className="text-xs text-slate-500 uppercase">{cliente.clntetipoidentificacion}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail className="w-3 h-3 mr-2" />
                        {cliente.clntecorreo}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Phone className="w-3 h-3 mr-2" />
                        {cliente.clntetelefono}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={cliente.clnteestado === 'activo' ? 'default' : 'secondary'}
                      className={
                        cliente.clnteestado === 'activo'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      }
                    >
                      {cliente.clnteestado === 'activo' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setClienteToEdit(cliente)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar información
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {cliente.clnteestado === 'activo' ? (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(cliente, 'inactivo')}
                            className="text-amber-600"
                          >
                            <UserMinus className="mr-2 h-4 w-4" />
                            Marcar como inactivo
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(cliente, 'activo')}
                            className="text-emerald-600"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Marcar como activo
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(cliente, 'eliminado')}
                          className="text-rose-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Dar de baja
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
          <div className="text-sm text-slate-500">
            Mostrando página {page} de {data.totalPages} ({data.totalItems} clientes)
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === data.totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {clienteToEdit && (
        <EditClienteModal
          cliente={clienteToEdit}
          open={!!clienteToEdit}
          onOpenChange={(open) => !open && setClienteToEdit(null)}
        />
      )}
    </div>
  );
};
