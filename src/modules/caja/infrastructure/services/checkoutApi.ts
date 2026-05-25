import { apiClient } from '../../../../shared/lib/apiClient';
import type { Checkout, PaginatedCheckouts, CreateCheckoutDto, UpdateCheckoutStatusDto } from '../../domain/entities/Checkout';

export const checkoutApi = {
  getCheckouts: async (page: number, pageSize: number): Promise<PaginatedCheckouts> => {
    const response = await apiClient.get<PaginatedCheckouts>('/checkouts', {
      params: { page, pageSize },
    });
    return response.data;
  },

  createCheckout: async (data: CreateCheckoutDto): Promise<Checkout> => {
    const response = await apiClient.post<Checkout>('/checkouts', data);
    return response.data;
  },

  updateCheckoutStatus: async (id: string, data: UpdateCheckoutStatusDto): Promise<Checkout> => {
    const response = await apiClient.patch<Checkout>(`/checkouts/${id}/status`, data);
    return response.data;
  },
};
