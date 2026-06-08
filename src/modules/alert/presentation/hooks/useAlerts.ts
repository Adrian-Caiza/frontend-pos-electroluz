import { useQuery } from '@tanstack/react-query';
import { AlertRepository } from '../../infrastructure/repositories/AlertRepository';
import { GetAlertsUseCase } from '../../application/use-cases/GetAlertsUseCase';

export const useAlerts = (page: number, pageSize: number, suid?: string) => {
  return useQuery({
    queryKey: ['alerts', page, pageSize, suid],
    queryFn: async () => {
      const repository = new AlertRepository();
      const useCase = new GetAlertsUseCase(repository);
      return useCase.execute(page, pageSize, suid);
    },
    refetchInterval: false,
  });
};
