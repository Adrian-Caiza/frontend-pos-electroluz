import type { ICheckoutRepository } from '../../domain/repositories/ICheckoutRepository';
import type { Checkout, PaginatedCheckouts, CreateCheckoutDto, UpdateCheckoutStatusDto } from '../../domain/entities/Checkout';
import { checkoutApi } from '../services/checkoutApi';

export class CheckoutRepository implements ICheckoutRepository {
  async getCheckouts(page: number, pageSize: number): Promise<PaginatedCheckouts> {
    return checkoutApi.getCheckouts(page, pageSize);
  }

  async createCheckout(data: CreateCheckoutDto): Promise<Checkout> {
    return checkoutApi.createCheckout(data);
  }

  async updateCheckoutStatus(id: string, data: UpdateCheckoutStatusDto): Promise<Checkout> {
    return checkoutApi.updateCheckoutStatus(id, data);
  }
}
