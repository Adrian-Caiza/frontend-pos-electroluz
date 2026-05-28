import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProformaRepository } from '../../infrastructure/ProformaRepository';
import { PayProformaUseCase } from '../../application/use-cases/PayProformaUseCase';

const repository = new ProformaRepository();
const payProformaUseCase = new PayProformaUseCase(repository);

export const usePayProforma = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => payProformaUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proformas'] });
    },
  });
};
