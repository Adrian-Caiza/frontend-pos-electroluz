import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckoutRepository } from '../../infrastructure/repositories/CheckoutRepository';
import { UpdateCheckoutStatusUseCase } from '../../application/use-cases/UpdateCheckoutStatusUseCase';
import type { UpdateCheckoutStatusDto } from '../../domain/entities/Checkout';
import { toast } from 'sonner';

const checkoutRepository = new CheckoutRepository();
const updateCheckoutStatusUseCase = new UpdateCheckoutStatusUseCase(checkoutRepository);

interface UpdateParams {
  id: string;
  data: UpdateCheckoutStatusDto;
}

export const useUpdateCheckoutStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateParams) => updateCheckoutStatusUseCase.execute(id, data),
    onSuccess: () => {
      toast.success('Operación exitosa', {
        description: 'Estado actualizado correctamente'
      });
      queryClient.invalidateQueries({ queryKey: ['cajas'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar el estado';
      toast.error('Ocurrió un error', {
        description: message
      });
    },
  });
};
