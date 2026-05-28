import { useQuery } from '@tanstack/react-query';
import { StockRepository } from '../../infrastructure/repositories/StockRepository';
import { GetStocksUseCase } from '../../application/use-cases/GetStocksUseCase';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';

const repository = new StockRepository();
const useCase = new GetStocksUseCase(repository);

export const useStocks = (suidentificador: string | undefined, stcksuid: string | undefined, page: number, pageSize: number) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['stocks', suidentificador, stcksuid, page, pageSize],
    queryFn: () => useCase.execute(suidentificador, stcksuid, page, pageSize),
    // Solo consultar si hay usuario y al menos uno de los dos filtros de sucursal
    enabled: !!user && (!!suidentificador || !!stcksuid),
  });
};
