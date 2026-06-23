import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MarcaRepository } from '../../infrastructure/repositories/MarcaRepository';
import type { Marca } from '../../domain/entities/Marca';
import { toast } from 'sonner';

const repository = new MarcaRepository();

export const useCreateMarca = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Marca>) => repository.createMarca(data),
    onSuccess: () => {
      toast.success('Operación exitosa', {
        description: 'Marca creada exitosamente'
      });
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear la marca';
      toast.error('Ocurrió un error', {
        description: Array.isArray(message) ? message[0] : message
      });
    },
  });
};
