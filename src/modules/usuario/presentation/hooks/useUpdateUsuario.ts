import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UsuarioRepository } from '../../infrastructure/repositories/UsuarioRepository';
import { UpdateUsuarioUseCase } from '../../application/use-cases/UpdateUsuarioUseCase';
import type { UpdateUsuarioDto } from '../../domain/entities/Usuario';
import { toast } from 'sonner';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';

const repository = new UsuarioRepository();
const useCase = new UpdateUsuarioUseCase(repository);

export const useUpdateUsuario = () => {
  const queryClient = useQueryClient();
  const { user: currentUser, updateUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUsuarioDto }) => useCase.execute(id, data),
    onSuccess: (updatedUsuario, variables) => {
      toast.success('Operación exitosa', {
        description: 'Usuario actualizado exitosamente'
      });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });

      // If the updated user is the current user, update the global store
      if (currentUser?.usid === variables.id) {
        updateUser({
          usnombre: updatedUsuario.usnombre,
          usapodo: updatedUsuario.usapodo,
          uscorreo: updatedUsuario.uscorreo,
          usimagen: updatedUsuario.usimagen || undefined,
          usrol: updatedUsuario.usrol,
          usestado: updatedUsuario.usestado,
        });
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar el usuario';
      toast.error('Ocurrió un error', {
        description: Array.isArray(message) ? message[0] : message
      });
    },
  });
};
