import { useQuery } from '@tanstack/react-query';
import { CategoriaRepository } from '../../infrastructure/repositories/CategoriaRepository';

export const useCategorias = (page: number = 1, pageSize: number = 100) => {
  return useQuery({
    queryKey: ['categorias', page, pageSize],
    queryFn: async () => {
      const repository = new CategoriaRepository();
      return repository.getCategorias(page, pageSize);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
