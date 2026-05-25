import type { IProductoRepository } from '../../domain/repositories/IProductoRepository';
import type { Producto, CreateProductoDto, UpdateProductoDto } from '../../domain/entities/Producto';
import type { PaginatedResponse } from '../../../categoria/infrastructure/services/categoriaApi';
import { productoApi } from '../services/productoApi';

export class ProductoRepository implements IProductoRepository {
  async createProducto(data: CreateProductoDto): Promise<Producto> {
    return productoApi.create(data);
  }

  async updateProducto(id: string, data: UpdateProductoDto): Promise<Producto> {
    return productoApi.update(id, data);
  }

  async getProductos(page: number, pageSize: number): Promise<PaginatedResponse<Producto>> {
    return productoApi.getAll(page, pageSize);
  }
}
