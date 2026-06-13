import { useMutation, useQueryClient } from '@tanstack/react-query';
import { proveedorRepository } from '../../infrastructure/repositories/ProveedorRepository';
import type { CreateProveedorDto, Proveedor } from '../../domain/entities/Proveedor';
import { toast } from 'sonner';

export const useCreateProveedor = () => {
  const queryClient = useQueryClient();

  return useMutation<Proveedor, Error, CreateProveedorDto>({
    mutationFn: (data: CreateProveedorDto) => proveedorRepository.createProveedor(data),
    onSuccess: () => {
      toast.success('Proveedor registrado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
    },
    onError: (error: any) => {
      console.error("Mutation error details:", error, error.response?.data);
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      const displayMessage = serverMessage
        ? (Array.isArray(serverMessage) ? serverMessage[0] : serverMessage)
        : error.message || 'Error al registrar el proveedor';
      toast.error(displayMessage);
    },
  });
};
