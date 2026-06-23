import type { ISucursalRepository } from '../../domain/repositories/ISucursalRepository';
import type { PaginatedSucursales, Sucursal, CreateSucursalDto, UpdateSucursalDto } from '../../domain/entities/Sucursal';
import { sucursalApi } from '../services/sucursalApi';

export class SucursalRepository implements ISucursalRepository {
  async getSucursales(page: number, pageSize: number, search?: string, status?: string): Promise<PaginatedSucursales> {
    return sucursalApi.getSucursales(page, pageSize, search, status);
  }

  async createSucursal(data: CreateSucursalDto): Promise<Sucursal> {
    return sucursalApi.createSucursal(data);
  }

  async updateSucursal(id: string, data: UpdateSucursalDto): Promise<Sucursal> {
    return sucursalApi.updateSucursal(id, data);
  }
}
