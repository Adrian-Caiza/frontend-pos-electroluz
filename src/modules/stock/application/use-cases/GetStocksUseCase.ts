import type { IStockRepository } from '../../domain/repositories/IStockRepository';
import type { PaginatedStocks } from '../../domain/entities/Stock';

export class GetStocksUseCase {
  private repository: IStockRepository;

  constructor(repository: IStockRepository) {
    this.repository = repository;
  }

  async execute(suidentificador: string | undefined, stcksuid: string | undefined, page: number, pageSize: number): Promise<PaginatedStocks> {
    return this.repository.getStocksBySucursal(suidentificador, stcksuid, page, pageSize);
  }
}
