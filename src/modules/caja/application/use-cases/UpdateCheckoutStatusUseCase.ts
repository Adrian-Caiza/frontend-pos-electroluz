import type { ICheckoutRepository } from '../../domain/repositories/ICheckoutRepository';
import type { Checkout, UpdateCheckoutStatusDto } from '../../domain/entities/Checkout';

export class UpdateCheckoutStatusUseCase {
  private checkoutRepository: ICheckoutRepository;
  constructor(checkoutRepository: ICheckoutRepository) {
    this.checkoutRepository = checkoutRepository;
  }

  execute(id: string, data: UpdateCheckoutStatusDto): Promise<Checkout> {
    return this.checkoutRepository.updateCheckoutStatus(id, data);
  }
}
