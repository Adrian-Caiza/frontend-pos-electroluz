import { useQuery } from '@tanstack/react-query';
import { MetodoPagoRepository } from '../../infrastructure/MetodoPagoRepository';
import { GetMetodosPagoUseCase } from '../../application/use-cases/GetMetodosPagoUseCase';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';

const repository = new MetodoPagoRepository();
const getMetodosPagoUseCase = new GetMetodosPagoUseCase(repository);

export const useMetodosPago = (page: number, pageSize: number, search?: string, status?: string) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['metodosPago', user?.usemid, page, pageSize, search, status],
    queryFn: () => getMetodosPagoUseCase.execute(page, pageSize, search, status),
    enabled: !!user?.usemid,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
