import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertRepository } from '../../infrastructure/repositories/AlertRepository';
import { MarkAlertAsViewedUseCase } from '../../application/use-cases/MarkAlertAsViewedUseCase';

export const useMarkAlertAsViewed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const repository = new AlertRepository();
      const useCase = new MarkAlertAsViewedUseCase(repository);
      return useCase.execute(id);
    },
    onSuccess: () => {
      // Invalidate the alerts cache so that it re-fetches
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};
