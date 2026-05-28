import type { IProformaRepository } from '../domain/IProformaRepository';
import type { Proforma, CreateProformaDTO } from '../domain/Proforma';
import type { PaginatedResult } from '../../../shared/types/PaginatedResult';
import { fetchProformas, createProforma, cancelProforma, payProforma } from './proformaApi';

export class ProformaRepository implements IProformaRepository {
  async getProformas(page: number, pageSize: number): Promise<PaginatedResult<Proforma>> {
    return await fetchProformas(page, pageSize);
  }

  async createProforma(data: CreateProformaDTO): Promise<Proforma> {
    return await createProforma(data);
  }

  async cancelProforma(id: string): Promise<void> {
    await cancelProforma(id);
  }

  async payProforma(id: string): Promise<void> {
    await payProforma(id);
  }
}
