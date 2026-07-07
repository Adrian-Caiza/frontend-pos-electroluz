import { useQuery } from '@tanstack/react-query';
import { AlertRepository } from '../../infrastructure/repositories/AlertRepository';
import { GetAlertSummaryUseCase } from '../../application/use-cases/GetAlertSummaryUseCase';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';

export const useAlertSummary = () => {
  const token = useAuthStore((s) => s.token);
  
  return useQuery({
    queryKey: ['alert-summary'],
    queryFn: async () => {
      const repository = new AlertRepository();
      const useCase = new GetAlertSummaryUseCase(repository);
      return useCase.execute();
    },
    enabled: !!token,
    refetchInterval: 60000, 
  });
};
