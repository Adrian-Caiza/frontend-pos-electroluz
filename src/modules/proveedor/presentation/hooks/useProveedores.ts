import { useQuery } from '@tanstack/react-query';
import { ProveedorRepository } from '../../infrastructure/repositories/ProveedorRepository';

export const useProveedores = (page: number = 1, pageSize: number = 100) => {
  return useQuery({
    queryKey: ['proveedores', page, pageSize],
    queryFn: async () => {
      const repository = new ProveedorRepository();
      return repository.getProveedores(page, pageSize);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
