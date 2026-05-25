import type { IProductoRepository } from '../../domain/repositories/IProductoRepository';
import type { Producto, UpdateProductoDto } from '../../domain/entities/Producto';

export class UpdateProductoUseCase {
  private readonly repository: IProductoRepository;

  constructor(repository: IProductoRepository) {
    this.repository = repository;
  }

  async execute(id: string, data: UpdateProductoDto): Promise<Producto> {
    return this.repository.updateProducto(id, data);
  }
}
