export interface Alert {
  alid: string;
  alemid: string;
  branch?: {
    suid: string;
    sunombre: string;
    suidentificador: string;
  };
  product?: {
    prdtoid: string;
    prdtocodigo: string;
    prdtonombre: string;
  };
  altipo: 'stock_bajo' | string;
  almensaje: string;
  alcantidadactual?: number;
  alstockminimo?: number;
  alstockmaximo?: number;
  alvisible: boolean;
  alvisto: boolean;
  alfchcreacion: string;
}

export interface PaginatedAlerts {
  items: Alert[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
