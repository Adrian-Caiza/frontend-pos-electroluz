export interface Stock {
  stckid: string;
  stckemid: string;
  sucursal: {
    suid: string;
    sunombre: string;
    suidentificador: string;
  };
  producto: {
    prdtoid: string;
    prdtocodigo: string;
    prdtonombre: string;
  };
  stckcantidad: number | string; // The API might return stringified numbers "800.00"
  stckfchregistro: string;
  stckfchactualizacion: string;
  stckestado: 'activo' | 'inactivo' | 'eliminado';
}

export interface PaginatedStocks {
  items: Stock[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CreateStockDto {
  stckemid: string;
  stcksuid: string;
  stckprdtoid: string;
  stckcantidad: number;
}

export interface UpdateStockDto {
  stcksuid: string; // Obligatorio según la API
  stckcantidad?: number;
  stckestado?: 'activo' | 'inactivo' | 'eliminado';
}
