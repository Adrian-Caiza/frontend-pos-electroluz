import { useMutation, useQueryClient } from '@tanstack/react-query';
import { proveedorRepository } from '../../infrastructure/repositories/ProveedorRepository';
import type { UpdateProveedorDto, Proveedor } from '../../domain/entities/Proveedor';

export const useUpdateProveedor = () => {
  const queryClient = useQueryClient();

  return useMutation<Proveedor, Error, { id: string; data: UpdateProveedorDto }>({
    mutationFn: ({ id, data }) => proveedorRepository.updateProveedor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
    },
  });
};
