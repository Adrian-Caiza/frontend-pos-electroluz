import { useQuery } from '@tanstack/react-query';
import { ClienteRepository } from '../../infrastructure/repositories/ClienteRepository';
import { GetClientesUseCase } from '../../application/use-cases/GetClientesUseCase';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';

const repository = new ClienteRepository();
const useCase = new GetClientesUseCase(repository);

export const useClientes = (page: number, pageSize: number) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['clientes', page, pageSize],
    queryFn: () => useCase.execute(page, pageSize),
    enabled: !!user,
  });
};
