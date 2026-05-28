import { apiClient } from '../../../../shared/lib/apiClient';
import type {
  Stock,
  PaginatedStocks,
  CreateStockDto,
  UpdateStockDto,
} from '../../domain/entities/Stock';

export const stockApi = {
  getStocksBySucursal: async (suidentificador: string | undefined, stcksuid: string | undefined, page: number, pageSize: number): Promise<PaginatedStocks> => {
    const params: any = { page, pageSize };
    if (stcksuid) params.stcksuid = stcksuid;
    else if (suidentificador) params.suidentificador = suidentificador;

    const response = await apiClient.get('/stocks', { params });
    return response.data;
  },

  createStock: async (data: CreateStockDto): Promise<Stock> => {
    const response = await apiClient.post('/stocks', data);
    return response.data;
  },

  updateStock: async (id: string, data: UpdateStockDto): Promise<Stock> => {
    const response = await apiClient.patch(`/stocks/${id}`, data);
    return response.data;
  },
};
