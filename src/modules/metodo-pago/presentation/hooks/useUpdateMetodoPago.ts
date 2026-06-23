import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MetodoPagoRepository } from '../../infrastructure/MetodoPagoRepository';
import { UpdateMetodoPagoUseCase } from '../../application/use-cases/UpdateMetodoPagoUseCase';
import type { UpdateMetodoPagoDTO } from '../../domain/MetodoPago';

const repository = new MetodoPagoRepository();
const updateMetodoPagoUseCase = new UpdateMetodoPagoUseCase(repository);

export const useUpdateMetodoPago = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMetodoPagoDTO }) => 
      updateMetodoPagoUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metodosPago'] });
    },
  });
};
