import { useQuery } from '@tanstack/react-query';
import { StockRepository } from '../../infrastructure/repositories/StockRepository';
import { GetStocksUseCase } from '../../application/use-cases/GetStocksUseCase';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';

const repository = new StockRepository();
const useCase = new GetStocksUseCase(repository);

export const useStocks = (suidentificador: string | undefined, stcksuid: string | undefined, page: number, pageSize: number, search?: string) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['stocks', suidentificador, stcksuid, page, pageSize, search],
    queryFn: () => useCase.execute(suidentificador, stcksuid, page, pageSize, search),
    
    enabled: !!user && (!!suidentificador || !!stcksuid),
  });
};
