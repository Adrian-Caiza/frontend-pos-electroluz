import type { Proforma, CreateProformaDTO, UpdateProformaDTO, ProformaPdfResponse } from './Proforma';
import type { PaginatedResult } from '../../../shared/types/PaginatedResult';

export interface IProformaRepository {
  getProformas(page: number, pageSize: number, search?: string, status?: string): Promise<PaginatedResult<Proforma>>;
  createProforma(data: CreateProformaDTO): Promise<Proforma>;
  fetchProformaById(id: string): Promise<Proforma>;
  updateProforma(id: string, data: UpdateProformaDTO): Promise<Proforma>;
  cancelProforma(id: string): Promise<void>;
  payProforma(id: string): Promise<void>;
  getProformaPdf(id: string): Promise<ProformaPdfResponse>;
}
