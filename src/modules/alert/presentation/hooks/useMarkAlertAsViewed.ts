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
      // Invalida la lista de alertas para la tabla general
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      
      try {
        // Obtenemos el resumen explícitamente después del 200 OK
        const repository = new AlertRepository();
        const summaryUseCase = new GetAlertSummaryUseCase(repository);
        const summary = await summaryUseCase.execute();
        
        const state = useAlertStore.getState();
        // Actualizamos el contador explícitamente con la respuesta real del backend
        state.setUnseenCount(summary.totalUnseen);
        // Removemos la alerta de la campana solo si fue confirmada por el servidor
        state.removeBellAlert(id);
        
        // Sincronizamos la caché de React Query para otros componentes que lo usen
        queryClient.setQueryData(['alert-summary'], summary);
      } catch (error) {
        console.error('Failed to sync alert summary after marking as viewed:', error);
      }
    },
  });
};
