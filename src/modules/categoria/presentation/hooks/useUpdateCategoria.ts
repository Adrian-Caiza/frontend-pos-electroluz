import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CategoriaRepository } from '../../infrastructure/repositories/CategoriaRepository';
import type { Categoria } from '../../domain/entities/Categoria';
import { toast } from 'sonner';

const repository = new CategoriaRepository();

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Categoria> }) => 
      repository.updateCategoria(id, data),
    onSuccess: () => {
      toast.success('Operación exitosa', {
        description: 'Categoría actualizada exitosamente'
      });
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar la categoría';
      toast.error('Ocurrió un error', {
        description: Array.isArray(message) ? message[0] : message
      });
    },
  });
};
