import type { IProductoRepository } from '../../domain/repositories/IProductoRepository';
import type { Producto, CreateProductoDto } from '../../domain/entities/Producto';

export class CreateProductoUseCase {
  private readonly repository: IProductoRepository;

  constructor(repository: IProductoRepository) {
    this.repository = repository;
  }

  async execute(data: CreateProductoDto): Promise<Producto> {
    return this.repository.createProducto(data);
  }
}
