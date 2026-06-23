import { apiClient } from '../../../../shared/lib/apiClient';
import type { Alert, PaginatedAlerts, AlertSummary } from '../../domain/entities/Alert';

export function mapToAlert(data: any): Alert {
  return {
    id: data.alid,
    type: data.altipo,
    message: data.almensaje,
    isViewed: data.alvisto,
    createdAt: data.alfchcreacion,
    updatedAt: data.alfchactualizacion,
    currentQuantity: data.alcantidadactual,
    minStock: data.alstockminimo,
    maxStock: data.alstockmaximo,
    branch: data.branch ? {
      id: data.branch.suid,
      name: data.branch.sunombre,
      code: data.branch.suidentificador
    } : undefined,
    product: data.product ? {
      id: data.product.prdtoid,
      code: data.product.prdtocodigo,
      name: data.product.prdtonombre
    } : undefined
  };
}

export const alertApi = {
  getAlerts: async (page: number, pageSize: number, opts?: { suid?: string; visible?: boolean; visto?: boolean; tipo?: string }): Promise<PaginatedAlerts> => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (opts?.suid) params.append('suid', opts.suid);
    if (opts?.visible !== undefined) params.append('visible', String(opts.visible));
    if (opts?.visto !== undefined) params.append('visto', String(opts.visto));
    if (opts?.tipo) params.append('tipo', opts.tipo);

    const response = await apiClient.get(`/alerts?${params.toString()}`);
    return {
      ...response.data,
      items: response.data.items.map(mapToAlert)
    };
  },

  getSummary: async (): Promise<AlertSummary> => {
    const response = await apiClient.get('/alerts/summary');
    return response.data;
  },

  markAsViewed: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.patch(`/alerts/${id}/visto`);
    return response.data;
  }
};
