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
import { MoreHorizontal, ImageOff, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';
import { useProductos } from '../hooks/useProductos';
import { useUpdateProducto } from '../hooks/useUpdateProducto';
import type { Producto } from '../../domain/entities/Producto';
import { EditProductoModal } from './EditProductoModal';

export const ProductoTable = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useProductos(page, pageSize);
  const updateMutation = useUpdateProducto();
  const { user } = useAuthStore();
  const isJefe = user?.usrol === 'jefe';

  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
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

  const handleStatusChange = (producto: Producto, newStatus: 'activo' | 'inactivo' | 'eliminado') => {
    updateMutation.mutate({
      id: producto.prdtoid,
      data: { prdtoestado: newStatus }
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
        Cargando productos...
      </div>
    );
  }

  if (!data?.items.length) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-slate-500 space-y-4">
        <p>No hay productos registrados en esta empresa.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-16">Imagen</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría / Marca</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Estado</TableHead>
              {isJefe && <TableHead className="w-16 text-right">Ajustes</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((producto) => (
              <TableRow key={producto.prdtoid}>
                <TableCell>
                  <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                    {producto.prdtoimagen ? (
                      <img
                        src={getImageUrl(producto.prdtoimagen)!}
                        alt={producto.prdtonombre}
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
                      style={{ display: producto.prdtoimagen ? 'none' : 'flex' }}
                    >
                      <ImageOff className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">{producto.prdtonombre}</div>
                  <div className="text-xs text-slate-500">Cód: {producto.prdtocodigo}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-700">{producto.categoria?.ctgnombre || 'S/C'}</div>
                  <div className="text-xs text-slate-500">{producto.marca?.mrcnombre || 'S/M'}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-medium text-indigo-600">${Number(producto.prdtoprecioventa).toFixed(2)}</div>
                  <div className="text-xs text-slate-500">Costo: ${Number(producto.prdtopreciocompra).toFixed(2)}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="text-sm font-medium">{producto.prdtostockmaximo} {producto.medida?.mdiaabreviatura}</div>
                  <div className="text-xs text-slate-500">Min: {producto.prdtostockminimo}</div>
                </TableCell>
                <TableCell>{getStatusBadge(producto.prdtoestado)}</TableCell>
                {isJefe && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4 text-slate-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedProducto(producto);
                          setIsEditOpen(true);
                        }}>
                          Editar producto
                        </DropdownMenuItem>
                        {producto.prdtoestado === 'activo' ? (
                          <DropdownMenuItem className="text-amber-600" onClick={() => handleStatusChange(producto, 'inactivo')}>
                            Marcar como inactivo
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-emerald-600" onClick={() => handleStatusChange(producto, 'activo')}>
                            Marcar como activo
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-rose-600" onClick={() => handleStatusChange(producto, 'eliminado')}>
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4 border-t border-slate-200">
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

      <EditProductoModal
        producto={selectedProducto}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
};
