import { useQuery } from '@tanstack/react-query';
import { SucursalRepository } from '../../infrastructure/repositories/SucursalRepository';
import { GetSucursalesUseCase } from '../../application/use-cases/GetSucursalesUseCase';

const sucursalRepository = new SucursalRepository();
const getSucursalesUseCase = new GetSucursalesUseCase(sucursalRepository);

export const useSucursales = (page: number, pageSize: number, search?: string, status?: string) => {
  return useQuery({
    queryKey: ['sucursales', page, pageSize, search, status],
    queryFn: () => getSucursalesUseCase.execute(page, pageSize, search, status),
  });
};
