import { useQuery } from '@tanstack/react-query';
import { ProveedorRepository } from '../../infrastructure/repositories/ProveedorRepository';

export const useProveedores = (page: number = 1, pageSize: number = 10, search?: string, status?: string) => {
  return useQuery({
    queryKey: ['proveedores', page, pageSize, search, status],
    queryFn: async () => {
      const repository = new ProveedorRepository();
      return repository.getProveedores(page, pageSize, search, status);
    },
    staleTime: 1000 * 60 * 5, 
  });
};
