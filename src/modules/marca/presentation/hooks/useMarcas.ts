import { useQuery } from '@tanstack/react-query';
import { MarcaRepository } from '../../infrastructure/repositories/MarcaRepository';

export const useMarcas = (page: number = 1, pageSize: number = 100) => {
  return useQuery({
    queryKey: ['marcas', page, pageSize],
    queryFn: async () => {
      const repository = new MarcaRepository();
      return repository.getMarcas(page, pageSize);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
