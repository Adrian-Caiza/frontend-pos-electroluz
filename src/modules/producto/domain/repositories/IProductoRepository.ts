import type { Producto, CreateProductoDto, UpdateProductoDto } from '../entities/Producto';
import type { PaginatedResponse } from '../../../categoria/infrastructure/services/categoriaApi';

export interface IProductoRepository {
  createProducto(data: CreateProductoDto): Promise<Producto>;
  updateProducto(id: string, data: UpdateProductoDto): Promise<Producto>;
  getProductos(page: number, pageSize: number): Promise<PaginatedResponse<Producto>>;
}
