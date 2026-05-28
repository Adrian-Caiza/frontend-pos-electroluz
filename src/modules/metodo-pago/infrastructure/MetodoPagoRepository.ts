import type { IMetodoPagoRepository } from '../domain/IMetodoPagoRepository';
import type { MetodoPago, CreateMetodoPagoDTO, UpdateMetodoPagoDTO } from '../domain/MetodoPago';
import type { PaginatedResult } from '../../../shared/types/PaginatedResult';
import { 
  fetchMetodosPago, 
  fetchMetodoPagoById, 
  createMetodoPago, 
  updateMetodoPago 
} from './metodoPagoApi';

export class MetodoPagoRepository implements IMetodoPagoRepository {
  async getMetodosPago(page: number, pageSize: number): Promise<PaginatedResult<MetodoPago>> {
    return await fetchMetodosPago(page, pageSize);
  }

  async getMetodoPagoById(id: string): Promise<MetodoPago> {
    return await fetchMetodoPagoById(id);
  }

  async createMetodoPago(data: CreateMetodoPagoDTO): Promise<MetodoPago> {
    return await createMetodoPago(data);
  }

  async updateMetodoPago(id: string, data: UpdateMetodoPagoDTO): Promise<MetodoPago> {
    return await updateMetodoPago(id, data);
  }
}
