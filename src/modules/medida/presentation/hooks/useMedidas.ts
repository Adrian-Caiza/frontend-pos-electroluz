import { useQuery } from '@tanstack/react-query';
import { MedidaRepository } from '../../infrastructure/repositories/MedidaRepository';

export const useMedidas = (page: number = 1, pageSize: number = 100) => {
  return useQuery({
    queryKey: ['medidas', page, pageSize],
    queryFn: async () => {
      const repository = new MedidaRepository();
      return repository.getMedidas(page, pageSize);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
