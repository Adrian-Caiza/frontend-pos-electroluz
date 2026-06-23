import type { Checkout, PaginatedCheckouts, CreateCheckoutDto, UpdateCheckoutStatusDto } from '../entities/Checkout';

export interface ICheckoutRepository {
  getCheckouts(page: number, pageSize: number, search?: string, status?: string): Promise<PaginatedCheckouts>;
  createCheckout(data: CreateCheckoutDto): Promise<Checkout>;
  updateCheckoutStatus(id: string, data: UpdateCheckoutStatusDto): Promise<Checkout>;
}
