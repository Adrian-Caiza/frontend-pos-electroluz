import type { ICheckoutRepository } from '../../domain/repositories/ICheckoutRepository';
import type { PaginatedCheckouts } from '../../domain/entities/Checkout';

export class GetCheckoutsUseCase {
  constructor(private checkoutRepository: ICheckoutRepository) {}

  execute(page: number, pageSize: number): Promise<PaginatedCheckouts> {
    return this.checkoutRepository.getCheckouts(page, pageSize);
  }
}
