import { apiClient } from '../../../../shared/lib/apiClient';
import type { PaginatedAlerts } from '../../domain/entities/Alert';

export const alertApi = {
  getAlerts: async (page: number, pageSize: number, suid?: string): Promise<PaginatedAlerts> => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (suid) {
      params.append('suid', suid);
    }

    const response = await apiClient.get(`/alerts?${params.toString()}`);
    return response.data;
  },

  markAsViewed: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.patch(`/alerts/${id}/visto`);
    return response.data;
  }
};
