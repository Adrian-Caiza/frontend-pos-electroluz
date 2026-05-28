import { useQuery } from '@tanstack/react-query';
import { ProformaRepository } from '../../infrastructure/ProformaRepository';
import { GetProformasUseCase } from '../../application/use-cases/GetProformasUseCase';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';

const repository = new ProformaRepository();
const getProformasUseCase = new GetProformasUseCase(repository);

export const useProformas = (page: number, pageSize: number) => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['proformas', user?.usemid, page, pageSize],
    queryFn: () => getProformasUseCase.execute(page, pageSize),
    enabled: !!user?.usemid,
    staleTime: 1000 * 30, // 30 seconds (keep it relatively fresh since sales happen often)
  });
};
