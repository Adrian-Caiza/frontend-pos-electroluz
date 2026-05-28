import { apiClient } from '../../../shared/lib/apiClient';
import type { PaginatedResult } from '../../../shared/types/PaginatedResult';
import type { Proforma, CreateProformaDTO } from '../domain/Proforma';

export const fetchProformas = async (page: number, pageSize: number): Promise<PaginatedResult<Proforma>> => {
  const { data } = await apiClient.get<PaginatedResult<Proforma>>('/proformas', {
    params: { page, pageSize }
  });
  
  // Flatten 'proforma' wrapper from response
  return {
    items: data.items.map((item: any) => item.proforma),
    page: data.page,
    pageSize: data.pageSize,
    totalItems: data.totalItems,
    totalPages: data.totalPages
  };
};

export const createProforma = async (proforma: CreateProformaDTO): Promise<Proforma> => {
  const { data } = await apiClient.post<{proforma: Proforma}>('/proformas', proforma);
  return data.proforma;
};

export const cancelProforma = async (id: string): Promise<void> => {
  await apiClient.patch(`/proformas/${id}/cancel`);
};

export const payProforma = async (id: string): Promise<void> => {
  await apiClient.patch(`/proformas/${id}/pay`);
};
