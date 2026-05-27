import { useQuery } from '@tanstack/react-query';
import { UsuarioRepository } from '../../infrastructure/repositories/UsuarioRepository';
import { GetUsuariosUseCase } from '../../application/use-cases/GetUsuariosUseCase';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';

const repository = new UsuarioRepository();
const useCase = new GetUsuariosUseCase(repository);

export const useUsuarios = (page: number, pageSize: number) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['usuarios', page, pageSize],
    queryFn: () => useCase.execute(page, pageSize),
    enabled: !!user,
  });
};
