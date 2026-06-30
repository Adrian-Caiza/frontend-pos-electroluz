import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SucursalRepository } from '../../infrastructure/repositories/SucursalRepository';
import { CreateSucursalUseCase } from '../../application/use-cases/CreateSucursalUseCase';
import type { CreateSucursalDto } from '../../domain/entities/Sucursal';
import { toast } from 'sonner';

const sucursalRepository = new SucursalRepository();
const createSucursalUseCase = new CreateSucursalUseCase(sucursalRepository);

export const useCreateSucursal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSucursalDto) => {
      return createSucursalUseCase.execute(data);
    },
    onSuccess: () => {
      toast.success('Operación exitosa', {
        description: 'Sucursal creada exitosamente'
      });
      queryClient.invalidateQueries({ queryKey: ['sucursales'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear la sucursal';
      toast.error('Ocurrió un error', {
        description: Array.isArray(message) ? message[0] : message
      });
    },
  });
};
