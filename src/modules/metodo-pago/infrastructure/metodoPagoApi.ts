import { apiClient } from '../../../shared/lib/apiClient';
import type { PaginatedResult } from '../../../shared/types/PaginatedResult';
import type { MetodoPago, CreateMetodoPagoDTO, UpdateMetodoPagoDTO } from '../domain/MetodoPago';

export const fetchMetodosPago = async (page: number, pageSize: number, search?: string, status?: string): Promise<PaginatedResult<MetodoPago>> => {
  const params: Record<string, any> = { page, pageSize };
  if (search) params.search = search;
  if (status) params.status = status;
  const { data } = await apiClient.get<PaginatedResult<MetodoPago>>('/playment-methods', { params });
  return data;
};

export const fetchMetodoPagoById = async (id: string): Promise<MetodoPago> => {
  const { data } = await apiClient.get<{ metodoPago: MetodoPago }>(`/playment-methods/${id}`);
  return data.metodoPago;
};

export const createMetodoPago = async (metodoPago: CreateMetodoPagoDTO): Promise<MetodoPago> => {
  const { data } = await apiClient.post<MetodoPago>('/playment-methods', metodoPago);
  return data;
};

export const updateMetodoPago = async (id: string, metodoPago: UpdateMetodoPagoDTO): Promise<MetodoPago> => {
  const { data } = await apiClient.patch<MetodoPago>(`/playment-methods/${id}`, metodoPago);
  return data;
};
