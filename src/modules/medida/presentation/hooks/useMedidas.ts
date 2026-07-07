import { useQuery } from '@tanstack/react-query';
import { MedidaRepository } from '../../infrastructure/repositories/MedidaRepository';

export const useMedidas = (page: number = 1, pageSize: number = 10, search?: string, status?: string) => {
  return useQuery({
    queryKey: ['medidas', page, pageSize, search, status],
    queryFn: async () => {
      const repository = new MedidaRepository();
      return repository.getMedidas(page, pageSize, search, status);
    },
    staleTime: 1000 * 60 * 5, 
  });
};
