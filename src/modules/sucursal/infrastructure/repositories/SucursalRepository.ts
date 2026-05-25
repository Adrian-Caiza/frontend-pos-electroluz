import type { ISucursalRepository } from '../../domain/repositories/ISucursalRepository';
import type { PaginatedSucursales } from '../../domain/entities/Sucursal';
import { sucursalApi } from '../services/sucursalApi';

export class SucursalRepository implements ISucursalRepository {
  async getSucursales(page: number, pageSize: number): Promise<PaginatedSucursales> {
    return sucursalApi.getSucursales(page, pageSize);
  }
}
