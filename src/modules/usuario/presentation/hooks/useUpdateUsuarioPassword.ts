import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UsuarioRepository } from '../../infrastructure/repositories/UsuarioRepository';
import { UpdateUsuarioPasswordUseCase } from '../../application/use-cases/UpdateUsuarioPasswordUseCase';
import { toast } from 'sonner';

const repository = new UsuarioRepository();
const useCase = new UpdateUsuarioPasswordUseCase(repository);

export const useUpdateUsuarioPassword = () => {
  return useMutation({
    mutationFn: ({ id, uspassword }: { id: string; uspassword: string }) => useCase.execute(id, uspassword),
    onSuccess: () => {
      toast.success('Operación exitosa', {
        description: 'Contraseña actualizada exitosamente'
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar la contraseña';
      toast.error('Ocurrió un error', {
        description: Array.isArray(message) ? message[0] : message
      });
    },
  });
};
