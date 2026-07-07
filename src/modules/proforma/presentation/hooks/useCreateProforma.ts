import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProformaRepository } from '../../infrastructure/ProformaRepository';
import { CreateProformaUseCase } from '../../application/use-cases/CreateProformaUseCase';
import type { CreateProformaDTO } from '../../domain/Proforma';

const repository = new ProformaRepository();
const createProformaUseCase = new CreateProformaUseCase(repository);

export const useCreateProforma = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProformaDTO) => createProformaUseCase.execute(data),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['proformas'] });
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
  });
};
