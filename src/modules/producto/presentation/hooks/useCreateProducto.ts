import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreateProductoUseCase } from '../../application/use-cases/CreateProductoUseCase';
import { ProductoRepository } from '../../infrastructure/repositories/ProductoRepository';
import type { CreateProductoDto } from '../../domain/entities/Producto';

export const useCreateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductoDto) => {
      const repository = new ProductoRepository();
      const useCase = new CreateProductoUseCase(repository);
      return useCase.execute(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      toast.success('Operación exitosa', {
        description: 'Producto creado exitosamente'
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error al crear el producto';
      toast.error('Error de validación', {
        description: typeof errorMessage === 'string' ? errorMessage : 'Revise los campos e intente de nuevo'
      });
    },
  });
};
