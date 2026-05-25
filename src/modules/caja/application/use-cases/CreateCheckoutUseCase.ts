import type { ICheckoutRepository } from '../../domain/repositories/ICheckoutRepository';
import type { Checkout, CreateCheckoutDto } from '../../domain/entities/Checkout';

export class CreateCheckoutUseCase {
  constructor(private checkoutRepository: ICheckoutRepository) {}

  execute(data: CreateCheckoutDto): Promise<Checkout> {
    return this.checkoutRepository.createCheckout(data);
  }
}
