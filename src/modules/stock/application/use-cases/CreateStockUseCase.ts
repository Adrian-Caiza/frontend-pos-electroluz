import type { IStockRepository } from '../../domain/repositories/IStockRepository';
import type { Stock, CreateStockDto } from '../../domain/entities/Stock';

export class CreateStockUseCase {
  private repository: IStockRepository;

  constructor(repository: IStockRepository) {
    this.repository = repository;
  }

  async execute(data: CreateStockDto): Promise<Stock> {
    return this.repository.createStock(data);
  }
}
