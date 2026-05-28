import type { MetodoPago, CreateMetodoPagoDTO, UpdateMetodoPagoDTO } from './MetodoPago';
import type { PaginatedResult } from '../../../shared/types/PaginatedResult';

export interface IMetodoPagoRepository {
  getMetodosPago(page: number, pageSize: number): Promise<PaginatedResult<MetodoPago>>;
  getMetodoPagoById(id: string): Promise<MetodoPago>;
  createMetodoPago(data: CreateMetodoPagoDTO): Promise<MetodoPago>;
  updateMetodoPago(id: string, data: UpdateMetodoPagoDTO): Promise<MetodoPago>;
}
