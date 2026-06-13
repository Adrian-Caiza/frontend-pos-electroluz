import { useMutation, useQueryClient } from '@tanstack/react-query';
import { medidaRepository } from '../../infrastructure/repositories/MedidaRepository';
import type { UpdateMedidaDto, Medida } from '../../domain/entities/Medida';

export const useUpdateMedida = () => {
  const queryClient = useQueryClient();

  return useMutation<Medida, Error, { id: string; data: UpdateMedidaDto }>({
    mutationFn: ({ id, data }) => medidaRepository.updateMedida(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medidas'] });
    },
  });
};
