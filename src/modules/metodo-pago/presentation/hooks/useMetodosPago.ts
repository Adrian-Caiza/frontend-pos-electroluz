import { useQuery } from '@tanstack/react-query';
import { MetodoPagoRepository } from '../../infrastructure/MetodoPagoRepository';
import { GetMetodosPagoUseCase } from '../../application/use-cases/GetMetodosPagoUseCase';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';

const repository = new MetodoPagoRepository();
const getMetodosPagoUseCase = new GetMetodosPagoUseCase(repository);

export const useMetodosPago = (page: number, pageSize: number) => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['metodos-pago', user?.usemid, page, pageSize],
    queryFn: () => getMetodosPagoUseCase.execute(page, pageSize),
    enabled: !!user?.usemid,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
