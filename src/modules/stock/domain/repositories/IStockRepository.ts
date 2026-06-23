import type {
  Stock,
  PaginatedStocks,
  CreateStockDto,
  UpdateStockDto,
} from '../entities/Stock';

export interface IStockRepository {
  getStocksBySucursal(suidentificador: string | undefined, stcksuid: string | undefined, page: number, pageSize: number, search?: string, status?: string): Promise<PaginatedStocks>;
  createStock(data: CreateStockDto): Promise<Stock>;
  updateStock(id: string, data: UpdateStockDto): Promise<Stock>;
}
