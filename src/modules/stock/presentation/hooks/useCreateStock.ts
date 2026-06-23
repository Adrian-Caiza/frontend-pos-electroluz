import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StockRepository } from '../../infrastructure/repositories/StockRepository';
import { CreateStockUseCase } from '../../application/use-cases/CreateStockUseCase';
import type { CreateStockDto } from '../../domain/entities/Stock';
import { toast } from 'sonner';

const repository = new StockRepository();
const useCase = new CreateStockUseCase(repository);

export const useCreateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStockDto) => useCase.execute(data),
    onSuccess: () => {
      toast.success('Operación exitosa', {
        description: 'Stock registrado exitosamente'
      });
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al registrar el stock';
      toast.error('Ocurrió un error', {
        description: Array.isArray(message) ? message[0] : message
      });
    },
  });
};
