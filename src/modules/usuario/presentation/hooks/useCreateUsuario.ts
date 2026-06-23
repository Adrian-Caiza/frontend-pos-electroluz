import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UsuarioRepository } from '../../infrastructure/repositories/UsuarioRepository';
import { CreateUsuarioUseCase } from '../../application/use-cases/CreateUsuarioUseCase';
import type { CreateUsuarioDto } from '../../domain/entities/Usuario';
import { toast } from 'sonner';

const repository = new UsuarioRepository();
const useCase = new CreateUsuarioUseCase(repository);

export const useCreateUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUsuarioDto) => useCase.execute(data),
    onSuccess: () => {
      toast.success('Operación exitosa', {
        description: 'Usuario registrado exitosamente'
      });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al registrar el usuario';
      toast.error('Ocurrió un error', {
        description: Array.isArray(message) ? message[0] : message
      });
    },
  });
};
