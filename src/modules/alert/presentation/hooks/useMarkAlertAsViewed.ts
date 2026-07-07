import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertRepository } from '../../infrastructure/repositories/AlertRepository';
import { MarkAlertAsViewedUseCase } from '../../application/use-cases/MarkAlertAsViewedUseCase';
import { GetAlertSummaryUseCase } from '../../application/use-cases/GetAlertSummaryUseCase';
import { useAlertStore } from '../store/useAlertStore';

export const useMarkAlertAsViewed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const repository = new AlertRepository();
      const useCase = new MarkAlertAsViewedUseCase(repository);
      return useCase.execute(id);
    },
    onSuccess: async (data, id) => {
      
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      
      try {
        
        const repository = new AlertRepository();
        const summaryUseCase = new GetAlertSummaryUseCase(repository);
        const summary = await summaryUseCase.execute();
        
        const state = useAlertStore.getState();
        
        state.setUnseenCount(summary.totalUnseen);
        
        state.removeBellAlert(id);
        
        
        queryClient.setQueryData(['alert-summary'], summary);
      } catch (error) {
        console.error('Failed to sync alert summary after marking as viewed:', error);
      }
    },
  });
};
