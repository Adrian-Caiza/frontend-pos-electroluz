import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CategoriaRepository } from '../../infrastructure/repositories/CategoriaRepository';
import type { Categoria } from '../../domain/entities/Categoria';
import { toast } from 'sonner';

const repository = new CategoriaRepository();

export const useCreateCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Categoria>) => repository.createCategoria(data),
    onSuccess: () => {
      toast.success('Categoría creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear la categoría';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
};
