import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClienteRepository } from '../../infrastructure/repositories/ClienteRepository';
import { UpdateClienteUseCase } from '../../application/use-cases/UpdateClienteUseCase';
import type { UpdateClienteDto } from '../../domain/entities/Cliente';
import { toast } from 'sonner';

const repository = new ClienteRepository();
const useCase = new UpdateClienteUseCase(repository);

export const useUpdateCliente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClienteDto }) => useCase.execute(id, data),
    onSuccess: () => {
      toast.success('Operación exitosa', {
        description: 'Cliente actualizado exitosamente'
      });
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar el cliente';
      toast.error('Ocurrió un error', {
        description: Array.isArray(message) ? message[0] : message
      });
    },
  });
};
