import type { Proforma, CreateProformaDTO } from './Proforma';
import type { PaginatedResult } from '../../../shared/types/PaginatedResult';

export interface IProformaRepository {
  getProformas(page: number, pageSize: number): Promise<PaginatedResult<Proforma>>;
  createProforma(data: CreateProformaDTO): Promise<Proforma>;
  cancelProforma(id: string): Promise<void>;
  payProforma(id: string): Promise<void>;
}
