import { proveedorApi } from '../services/proveedorApi';
import type { Proveedor } from '../../domain/entities/Proveedor';
import type { PaginatedResponse } from '../../../categoria/infrastructure/services/categoriaApi';

export class ProveedorRepository {
  async getProveedores(page: number, pageSize: number): Promise<PaginatedResponse<Proveedor>> {
    return proveedorApi.getProveedores(page, pageSize);
  }
}
