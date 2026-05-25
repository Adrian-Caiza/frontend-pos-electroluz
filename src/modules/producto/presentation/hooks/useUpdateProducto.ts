import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UpdateProductoUseCase } from '../../application/use-cases/UpdateProductoUseCase';
import { ProductoRepository } from '../../infrastructure/repositories/ProductoRepository';
import type { UpdateProductoDto } from '../../domain/entities/Producto';

interface UpdateProductoVariables {
  id: string;
  data: UpdateProductoDto;
}

export const useUpdateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateProductoVariables) => {
      const repository = new ProductoRepository();
      const useCase = new UpdateProductoUseCase(repository);
      return useCase.execute(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      toast.success('Producto actualizado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el producto';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Error de validación');
    },
  });
};
