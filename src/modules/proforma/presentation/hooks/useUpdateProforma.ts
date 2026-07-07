import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProformaRepository } from '../../infrastructure/ProformaRepository';
import type { Proforma, UpdateProformaDTO } from '../../domain/Proforma';

const proformaRepository = new ProformaRepository();

export const useUpdateProforma = () => {
  const queryClient = useQueryClient();

  return useMutation<Proforma, Error, { id: string; data: UpdateProformaDTO }>({
    mutationFn: ({ id, data }) => proformaRepository.updateProforma(id, data),
    onSuccess: (updatedProforma) => {
      
      queryClient.invalidateQueries({ queryKey: ['proformas'] });
      
      queryClient.setQueryData(['proforma', updatedProforma.prfmaid], updatedProforma);
    },
  });
};
