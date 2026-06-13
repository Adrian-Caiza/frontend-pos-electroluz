import { useMutation, useQueryClient } from '@tanstack/react-query';
import { medidaRepository } from '../../infrastructure/repositories/MedidaRepository';
import type { CreateMedidaDto, Medida } from '../../domain/entities/Medida';

export const useCreateMedida = () => {
  const queryClient = useQueryClient();

  return useMutation<Medida, Error, CreateMedidaDto>({
    mutationFn: (data: CreateMedidaDto) => medidaRepository.createMedida(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medidas'] });
    },
  });
};
