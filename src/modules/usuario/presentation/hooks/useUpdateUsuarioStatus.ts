import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UsuarioRepository } from '../../infrastructure/repositories/UsuarioRepository';
import { UpdateUsuarioStatusUseCase } from '../../application/use-cases/UpdateUsuarioStatusUseCase';
import type { UpdateUsuarioStatusDto } from '../../domain/entities/Usuario';
import { toast } from 'sonner';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';

const repository = new UsuarioRepository();
const useCase = new UpdateUsuarioStatusUseCase(repository);

export const useUpdateUsuarioStatus = () => {
  const queryClient = useQueryClient();
  const { user: currentUser, updateUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUsuarioStatusDto }) => useCase.execute(id, data),
    onSuccess: (updatedUsuario, variables) => {
      toast.success('Operación exitosa', {
        description: 'Estado del usuario actualizado'
      });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });

      
      if (currentUser?.usid === variables.id) {
        updateUser({
          usestado: variables.data.usestado,
        });
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al cambiar estado del usuario';
      toast.error('Ocurrió un error', {
        description: Array.isArray(message) ? message[0] : message
      });
    },
  });
};
