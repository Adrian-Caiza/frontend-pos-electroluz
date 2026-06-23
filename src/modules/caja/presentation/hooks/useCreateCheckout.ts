import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckoutRepository } from '../../infrastructure/repositories/CheckoutRepository';
import { CreateCheckoutUseCase } from '../../application/use-cases/CreateCheckoutUseCase';
import type { CreateCheckoutDto } from '../../domain/entities/Checkout';
import { toast } from 'sonner';

const checkoutRepository = new CheckoutRepository();
const createCheckoutUseCase = new CreateCheckoutUseCase(checkoutRepository);

export const useCreateCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCheckoutDto) => createCheckoutUseCase.execute(data),
    onSuccess: () => {
      toast.success('Operación exitosa', {
        description: 'Caja registrada exitosamente'
      });
      // Invalidate queries to refetch the list
      queryClient.invalidateQueries({ queryKey: ['cajas'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al registrar la caja';
      toast.error('Ocurrió un error', {
        description: message
      });
    },
  });
};
