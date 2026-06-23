import { useQuery } from '@tanstack/react-query';
import { AlertRepository } from '../../infrastructure/repositories/AlertRepository';
import { GetAlertsUseCase } from '../../application/use-cases/GetAlertsUseCase';

export const useAlerts = (page: number, pageSize: number, opts?: { suid?: string; visible?: boolean; visto?: boolean; tipo?: string }) => {
  return useQuery({
    queryKey: ['alerts', page, pageSize, opts],
    queryFn: async () => {
      const repository = new AlertRepository();
      const useCase = new GetAlertsUseCase(repository);
      return useCase.execute(page, pageSize, opts);
    },
    refetchInterval: false,
    refetchOnMount: 'always',
  });
};
