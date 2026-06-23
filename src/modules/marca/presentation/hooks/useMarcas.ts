import { useQuery } from '@tanstack/react-query';
import { MarcaRepository } from '../../infrastructure/repositories/MarcaRepository';

export const useMarcas = (page: number = 1, pageSize: number = 10, search?: string, status?: string) => {
  return useQuery({
    queryKey: ['marcas', page, pageSize, search, status],
    queryFn: async () => {
      const repository = new MarcaRepository();
      return repository.getMarcas(page, pageSize, search, status);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
