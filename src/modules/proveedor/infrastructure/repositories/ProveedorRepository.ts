import { proveedorApiService } from '../services/proveedorApi';
import type { CreateProveedorDto, UpdateProveedorDto, Proveedor } from '../../domain/entities/Proveedor';
import type { PaginatedResponse } from '../../../categoria/infrastructure/services/categoriaApi';

export class ProveedorRepository {
  async getProveedores(page: number, pageSize: number, search?: string, status?: string): Promise<PaginatedResponse<Proveedor>> {
    return proveedorApiService.getProveedores(page, pageSize, search, status);
  }

  async getProveedorById(id: string): Promise<Proveedor> {
    return proveedorApiService.getProveedorById(id);
  }

  async createProveedor(data: CreateProveedorDto): Promise<Proveedor> {
    return proveedorApiService.createProveedor(data);
  }

  async updateProveedor(id: string, data: UpdateProveedorDto): Promise<Proveedor> {
    return proveedorApiService.updateProveedor(id, data);
  }
}

export const proveedorRepository = new ProveedorRepository();
