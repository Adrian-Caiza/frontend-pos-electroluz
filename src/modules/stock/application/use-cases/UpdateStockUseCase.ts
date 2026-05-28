import type { IStockRepository } from '../../domain/repositories/IStockRepository';
import type { Stock, UpdateStockDto } from '../../domain/entities/Stock';

export class UpdateStockUseCase {
  private repository: IStockRepository;

  constructor(repository: IStockRepository) {
    this.repository = repository;
  }

  async execute(id: string, data: UpdateStockDto): Promise<Stock> {
    return this.repository.updateStock(id, data);
  }
}
