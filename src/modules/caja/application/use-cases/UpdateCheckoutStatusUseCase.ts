import type { ICheckoutRepository } from '../../domain/repositories/ICheckoutRepository';
import type { Checkout, UpdateCheckoutStatusDto } from '../../domain/entities/Checkout';

export class UpdateCheckoutStatusUseCase {
  constructor(private checkoutRepository: ICheckoutRepository) {}

  execute(id: string, data: UpdateCheckoutStatusDto): Promise<Checkout> {
    return this.checkoutRepository.updateCheckoutStatus(id, data);
  }
}
