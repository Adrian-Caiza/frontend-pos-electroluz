import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MetodoPagoRepository } from '../../infrastructure/MetodoPagoRepository';
import { CreateMetodoPagoUseCase } from '../../application/use-cases/CreateMetodoPagoUseCase';
import type { CreateMetodoPagoDTO } from '../../domain/MetodoPago';

const repository = new MetodoPagoRepository();
const createMetodoPagoUseCase = new CreateMetodoPagoUseCase(repository);

export const useCreateMetodoPago = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMetodoPagoDTO) => createMetodoPagoUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metodos-pago'] });
    },
  });
};
