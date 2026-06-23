import { useMutation, useQueryClient } from '@tanstack/react-query';
import { proveedorRepository } from '../../infrastructure/repositories/ProveedorRepository';
import type { UpdateProveedorDto, Proveedor } from '../../domain/entities/Proveedor';
import { toast } from 'sonner';

export const useUpdateProveedor = () => {
  const queryClient = useQueryClient();

  return useMutation<Proveedor, Error, { id: string; data: UpdateProveedorDto }>({
    mutationFn: ({ id, data }) => proveedorRepository.updateProveedor(id, data),
    onSuccess: () => {
      toast.success('Operación exitosa', {
        description: 'Proveedor actualizado exitosamente'
      });
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar el proveedor';
      toast.error('Ocurrió un error', {
        description: Array.isArray(message) ? message[0] : message
      });
    },
  });
};
