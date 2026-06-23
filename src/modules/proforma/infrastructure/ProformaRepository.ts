import type { IProformaRepository } from '../domain/IProformaRepository';
import type { Proforma, CreateProformaDTO, UpdateProformaDTO, ProformaPdfResponse } from '../domain/Proforma';
import type { PaginatedResult } from '../../../shared/types/PaginatedResult';
import { fetchProformas, createProforma, cancelProforma, payProforma, fetchProformaById, updateProforma, fetchProformaPdf } from './proformaApi';

export class ProformaRepository implements IProformaRepository {
  async getProformas(page: number, pageSize: number, search?: string, status?: string): Promise<PaginatedResult<Proforma>> {
    return await fetchProformas(page, pageSize, search, status);
  }

  async createProforma(data: CreateProformaDTO): Promise<Proforma> {
    return await createProforma(data);
  }

  async fetchProformaById(id: string): Promise<Proforma> {
    return await fetchProformaById(id);
  }

  async updateProforma(id: string, data: UpdateProformaDTO): Promise<Proforma> {
    return await updateProforma(id, data);
  }

  async cancelProforma(id: string): Promise<void> {
    await cancelProforma(id);
  }

  async payProforma(id: string): Promise<void> {
    await payProforma(id);
  }

  async getProformaPdf(id: string): Promise<ProformaPdfResponse> {
    return await fetchProformaPdf(id);
  }
}
