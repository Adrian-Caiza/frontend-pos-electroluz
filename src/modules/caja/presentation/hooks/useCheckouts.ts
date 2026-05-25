import { useQuery } from '@tanstack/react-query';
import { CheckoutRepository } from '../../infrastructure/repositories/CheckoutRepository';
import { GetCheckoutsUseCase } from '../../application/use-cases/GetCheckoutsUseCase';

const checkoutRepository = new CheckoutRepository();
const getCheckoutsUseCase = new GetCheckoutsUseCase(checkoutRepository);

export const useCheckouts = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ['checkouts', page, pageSize],
    queryFn: () => getCheckoutsUseCase.execute(page, pageSize),
  });
};
