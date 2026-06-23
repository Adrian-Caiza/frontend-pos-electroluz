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
      const created = await createSucursalUseCase.execute(data);
      // Workaround: Backend ignores sudireccion and sucorreo on POST /branches.
      // We manually trigger a PATCH immediately after creation to save them.
      if (data.sudireccion || data.sucorreo) {
        await sucursalRepository.updateSucursal(created.suid, {
          sudireccion: data.sudireccion,
          sucorreo: data.sucorreo
        });
      }
      return created;
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
