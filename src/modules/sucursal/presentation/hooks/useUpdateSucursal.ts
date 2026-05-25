import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SucursalRepository } from '../../infrastructure/repositories/SucursalRepository';
import { UpdateSucursalUseCase } from '../../application/use-cases/UpdateSucursalUseCase';
import type { UpdateSucursalDto } from '../../domain/entities/Sucursal';
import { toast } from 'sonner';

const sucursalRepository = new SucursalRepository();
const updateSucursalUseCase = new UpdateSucursalUseCase(sucursalRepository);

interface UpdateParams {
  id: string;
  data: UpdateSucursalDto;
}

export const useUpdateSucursal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateParams) => updateSucursalUseCase.execute(id, data),
    onSuccess: () => {
      toast.success('Sucursal actualizada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['sucursales'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar la sucursal';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
};
