import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClienteRepository } from '../../infrastructure/repositories/ClienteRepository';
import { CreateClienteUseCase } from '../../application/use-cases/CreateClienteUseCase';
import type { CreateClienteDto } from '../../domain/entities/Cliente';
import { toast } from 'sonner';

const repository = new ClienteRepository();
const useCase = new CreateClienteUseCase(repository);

export const useCreateCliente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClienteDto) => useCase.execute(data),
    onSuccess: () => {
      toast.success('Operación exitosa', {
        description: 'Cliente registrado exitosamente'
      });
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al registrar el cliente';
      toast.error('Ocurrió un error', {
        description: Array.isArray(message) ? message[0] : message
      });
    },
  });
};
