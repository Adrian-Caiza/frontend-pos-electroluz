import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UsuarioRepository } from '../../infrastructure/repositories/UsuarioRepository';
import { UpdateUsuarioStatusUseCase } from '../../application/use-cases/UpdateUsuarioStatusUseCase';
import type { UpdateUsuarioStatusDto } from '../../domain/entities/Usuario';
import { toast } from 'sonner';

const repository = new UsuarioRepository();
const useCase = new UpdateUsuarioStatusUseCase(repository);

export const useUpdateUsuarioStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUsuarioStatusDto }) => useCase.execute(id, data),
    onSuccess: () => {
      toast.success('Estado del usuario actualizado');
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al cambiar estado del usuario';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
};
