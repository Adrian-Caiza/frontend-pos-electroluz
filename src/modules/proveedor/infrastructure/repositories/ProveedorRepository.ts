import { proveedorApi } from '../services/proveedorApi';
import type { CreateProveedorDto, UpdateProveedorDto, Proveedor } from '../../domain/entities/Proveedor';
import type { PaginatedResponse } from '../../../categoria/infrastructure/services/categoriaApi';

export class ProveedorRepository {
  async getProveedores(page: number, pageSize: number): Promise<PaginatedResponse<Proveedor>> {
    return proveedorApi.getProveedores(page, pageSize);
  }

  async getProveedorById(id: string): Promise<Proveedor> {
    return proveedorApi.getProveedorById(id);
  }

  async createProveedor(data: CreateProveedorDto): Promise<Proveedor> {
    return proveedorApi.createProveedor(data);
  }

  async updateProveedor(id: string, data: UpdateProveedorDto): Promise<Proveedor> {
    return proveedorApi.updateProveedor(id, data);
  }
}

export const proveedorRepository = new ProveedorRepository();
