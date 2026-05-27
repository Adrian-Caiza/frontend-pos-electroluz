import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UsuarioRepository } from '../../infrastructure/repositories/UsuarioRepository';
import { UpdateUsuarioUseCase } from '../../application/use-cases/UpdateUsuarioUseCase';
import type { UpdateUsuarioDto } from '../../domain/entities/Usuario';
import { toast } from 'sonner';

const repository = new UsuarioRepository();
const useCase = new UpdateUsuarioUseCase(repository);

export const useUpdateUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUsuarioDto }) => useCase.execute(id, data),
    onSuccess: () => {
      toast.success('Usuario actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar el usuario';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
};
