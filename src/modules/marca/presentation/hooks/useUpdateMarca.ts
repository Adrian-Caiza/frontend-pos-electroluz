import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MarcaRepository } from '../../infrastructure/repositories/MarcaRepository';
import type { Marca } from '../../domain/entities/Marca';
import { toast } from 'sonner';

const repository = new MarcaRepository();

export const useUpdateMarca = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Marca> }) => 
      repository.updateMarca(id, data),
    onSuccess: () => {
      toast.success('Operación exitosa', {
        description: 'Marca actualizada exitosamente'
      });
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar la marca';
      toast.error('Ocurrió un error', {
        description: Array.isArray(message) ? message[0] : message
      });
    },
  });
};
