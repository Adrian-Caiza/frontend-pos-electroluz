import { useQuery } from '@tanstack/react-query';
import { ProductoRepository } from '../../infrastructure/repositories/ProductoRepository';

export const useProductos = (page: number = 1, pageSize: number = 10, search?: string, status?: string) => {
  return useQuery({
    queryKey: ['productos', page, pageSize, search, status],
    queryFn: async () => {
      const repository = new ProductoRepository();
      return repository.getProductos(page, pageSize, search, status);
    },
    staleTime: 1000 * 60 * 5, 
  });
};
