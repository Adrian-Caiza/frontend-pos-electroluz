import { useQuery } from '@tanstack/react-query';
import { CategoriaRepository } from '../../infrastructure/repositories/CategoriaRepository';

export const useCategorias = (page: number = 1, pageSize: number = 100, search?: string, status?: string) => {
  return useQuery({
    queryKey: ['categorias', page, pageSize, search, status],
    queryFn: async () => {
      const repository = new CategoriaRepository();
      return repository.getCategorias(page, pageSize, search, status);
    },
    staleTime: 1000 * 60 * 5, 
  });
};
