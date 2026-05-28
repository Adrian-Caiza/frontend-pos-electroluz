import type { IStockRepository } from '../../domain/repositories/IStockRepository';
import type {
  Stock,
  PaginatedStocks,
  CreateStockDto,
  UpdateStockDto,
} from '../../domain/entities/Stock';
import { stockApi } from '../services/stockApi';

export class StockRepository implements IStockRepository {
  async getStocksBySucursal(suidentificador: string | undefined, stcksuid: string | undefined, page: number, pageSize: number): Promise<PaginatedStocks> {
    return stockApi.getStocksBySucursal(suidentificador, stcksuid, page, pageSize);
  }

  async createStock(data: CreateStockDto): Promise<Stock> {
    return stockApi.createStock(data);
  }

  async updateStock(id: string, data: UpdateStockDto): Promise<Stock> {
    return stockApi.updateStock(id, data);
  }
}
