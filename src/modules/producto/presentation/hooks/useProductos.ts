import { useQuery } from '@tanstack/react-query';
import { ProductoRepository } from '../../infrastructure/repositories/ProductoRepository';

export const useProductos = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['productos', page, pageSize],
    queryFn: async () => {
      const repository = new ProductoRepository();
      return repository.getProductos(page, pageSize);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
