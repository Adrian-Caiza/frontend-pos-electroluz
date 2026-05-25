import type { ICheckoutRepository } from '../../domain/repositories/ICheckoutRepository';
import type { Checkout, CreateCheckoutDto } from '../../domain/entities/Checkout';

export class CreateCheckoutUseCase {
  private checkoutRepository: ICheckoutRepository;
  constructor(checkoutRepository: ICheckoutRepository) {
    this.checkoutRepository = checkoutRepository;
  }

  execute(data: CreateCheckoutDto): Promise<Checkout> {
    return this.checkoutRepository.createCheckout(data);
  }
}
