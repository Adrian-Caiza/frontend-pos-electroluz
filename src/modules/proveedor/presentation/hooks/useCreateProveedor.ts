import { useMutation, useQueryClient } from '@tanstack/react-query';
import { proveedorRepository } from '../../infrastructure/repositories/ProveedorRepository';
import type { CreateProveedorDto, Proveedor } from '../../domain/entities/Proveedor';

export const useCreateProveedor = () => {
  const queryClient = useQueryClient();

  return useMutation<Proveedor, Error, CreateProveedorDto>({
    mutationFn: (data: CreateProveedorDto) => proveedorRepository.createProveedor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
    },
  });
};
