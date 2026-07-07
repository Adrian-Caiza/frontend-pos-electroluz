import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProformaRepository } from '../../infrastructure/ProformaRepository';
import { CancelProformaUseCase } from '../../application/use-cases/CancelProformaUseCase';

const repository = new ProformaRepository();
const cancelProformaUseCase = new CancelProformaUseCase(repository);

export const useCancelProforma = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelProformaUseCase.execute(id),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['proformas'] });
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
  });
};
