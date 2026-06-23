import type { ICheckoutRepository } from '../../domain/repositories/ICheckoutRepository';
import type { PaginatedCheckouts } from '../../domain/entities/Checkout';

export class GetCheckoutsUseCase {
  private checkoutRepository: ICheckoutRepository;
  constructor(checkoutRepository: ICheckoutRepository) {
    this.checkoutRepository = checkoutRepository;
  }

  execute(page: number, pageSize: number, search?: string, status?: string): Promise<PaginatedCheckouts> {
    return this.checkoutRepository.getCheckouts(page, pageSize, search, status);
  }
}
