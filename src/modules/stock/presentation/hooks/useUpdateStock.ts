import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StockRepository } from '../../infrastructure/repositories/StockRepository';
import { UpdateStockUseCase } from '../../application/use-cases/UpdateStockUseCase';
import type { UpdateStockDto } from '../../domain/entities/Stock';
import { toast } from 'sonner';

const repository = new StockRepository();
const useCase = new UpdateStockUseCase(repository);

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStockDto }) => useCase.execute(id, data),
    onSuccess: () => {
      toast.success('Stock actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar el stock';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
};
