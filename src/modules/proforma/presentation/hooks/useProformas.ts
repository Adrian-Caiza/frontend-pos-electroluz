import { useQuery } from '@tanstack/react-query';
import { ProformaRepository } from '../../infrastructure/ProformaRepository';
import { GetProformasUseCase } from '../../application/use-cases/GetProformasUseCase';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';

const repository = new ProformaRepository();
const getProformasUseCase = new GetProformasUseCase(repository);

export const useProformas = (page: number, pageSize: number, search?: string, status?: string) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['proformas', user?.usemid, page, pageSize, search, status],
    queryFn: () => getProformasUseCase.execute(page, pageSize, search, status),
    enabled: !!user?.usemid,
    staleTime: 1000 * 30, 
  });
};
