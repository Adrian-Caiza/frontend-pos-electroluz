import { useQuery } from '@tanstack/react-query';
import { SucursalRepository } from '../../infrastructure/repositories/SucursalRepository';
import { GetSucursalesUseCase } from '../../application/use-cases/GetSucursalesUseCase';

const sucursalRepository = new SucursalRepository();
const getSucursalesUseCase = new GetSucursalesUseCase(sucursalRepository);

export const useSucursales = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ['sucursales', page, pageSize],
    queryFn: () => getSucursalesUseCase.execute(page, pageSize),
  });
};
