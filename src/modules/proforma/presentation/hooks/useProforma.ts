import { useQuery } from '@tanstack/react-query';
import { ProformaRepository } from '../../infrastructure/ProformaRepository';
import type { Proforma } from '../../domain/Proforma';

const proformaRepository = new ProformaRepository();

export const useProforma = (id: string | null) => {
  return useQuery<Proforma, Error>({
    queryKey: ['proforma', id],
    queryFn: () => {
      if (!id) throw new Error('ID is required');
      return proformaRepository.fetchProformaById(id);
    },
    enabled: !!id,
  });
};
