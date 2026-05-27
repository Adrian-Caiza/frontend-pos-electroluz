import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../shared/components/ui/table';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import { MoreHorizontal, User, ArrowLeft, ArrowRight, Shield } from 'lucide-react';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { useUsuarios } from '../hooks/useUsuarios';
import { useUpdateUsuarioStatus } from '../hooks/useUpdateUsuarioStatus';
import type { Usuario } from '../../domain/entities/Usuario';
import { EditUsuarioModal } from './EditUsuarioModal';

export const UsuarioTable = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useUsuarios(page, pageSize);
  const updateStatusMutation = useUpdateUsuarioStatus();
  const { user: currentUser, company } = useAuthStore();
  const isJefe = currentUser?.usrol === 'jefe';

  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'activo':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Activo</Badge>;
      case 'inactivo':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Inactivo</Badge>;
      case 'eliminado':
        return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100">Eliminado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'administrador':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100"><Shield className="w-3 h-3 mr-1" />Admin</Badge>;
      case 'jefe':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Jefe</Badge>;
      case 'empleado':
        return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">Empleado</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const handleStatusChange = (usuario: Usuario, newStatus: 'activo' | 'inactivo' | 'eliminado') => {
    if (!company?.emid) return;
    
    updateStatusMutation.mutate({
      id: usuario.usid,
      data: { 
        usemid: company.emid,
        usestado: newStatus 
      }
    });
  };

  const getImageUrl = (rawPath: string | null) => {
    if (!rawPath || rawPath === 'null' || rawPath === 'undefined' || rawPath.trim() === '') return null;
    
    const imagePath = rawPath.replace(/\\/g, '/');
    if (imagePath.startsWith('blob:')) return imagePath;

    if (imagePath.startsWith('http')) {
      try {
        const url = new URL(imagePath);
        const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
        const isApiHost = import.meta.env.VITE_API_URL && url.hostname === new URL(import.meta.env.VITE_API_URL).hostname;
        const isKnownIP = url.hostname === '163.245.192.54';
        
        if (isLocalhost || isApiHost || isKnownIP) {
          return `/api-proxy${url.pathname}`;
        }
        return imagePath;
      } catch (e) {
        return imagePath;
      }
    }
    
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `/api-proxy${path}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        Cargando personal...
      </div>
    );
  }

  if (!data?.items.length) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-slate-500 space-y-4">
        <p>No hay usuarios registrados en esta empresa.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md overflow-x-auto bg-white border border-slate-200">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-16">Avatar</TableHead>
              <TableHead>Personal</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Rol Operativo</TableHead>
              <TableHead>Estado</TableHead>
              {isJefe && <TableHead className="w-16 text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((usuario) => (
              <TableRow key={usuario.usid} className={usuario.usestado === 'eliminado' ? 'opacity-50 bg-slate-50' : ''}>
                <TableCell>
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                    {usuario.usimagen ? (
                      <img
                        src={getImageUrl(usuario.usimagen)!}
                        alt={usuario.usnombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-slate-100"
                      style={{ display: usuario.usimagen ? 'none' : 'flex' }}
                    >
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">{usuario.usnombre}</div>
                  <div className="text-xs text-slate-500">@{usuario.usapodo}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-700">{usuario.uscorreo}</div>
                </TableCell>
                <TableCell>{getRoleBadge(usuario.usrol)}</TableCell>
                <TableCell>{getStatusBadge(usuario.usestado)}</TableCell>
                {isJefe && (
                  <TableCell className="text-right">
                    {usuario.usestado !== 'eliminado' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedUsuario(usuario);
                            setIsEditOpen(true);
                          }}>
                            Editar Perfil / Rol
                          </DropdownMenuItem>
                          
                          {usuario.usestado === 'activo' ? (
                            <DropdownMenuItem className="text-amber-600" onClick={() => handleStatusChange(usuario, 'inactivo')}>
                              Marcar como Inactivo
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-emerald-600" onClick={() => handleStatusChange(usuario, 'activo')}>
                              Marcar como Activo
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem className="text-rose-600" onClick={() => handleStatusChange(usuario, 'eliminado')}>
                            Dar de Baja (Eliminar)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4 border-t border-slate-200 mt-4">
          <div className="text-sm text-slate-500">
            Página {data.page} de {data.totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
            >
              Siguiente <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <EditUsuarioModal
        usuario={selectedUsuario}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
};
