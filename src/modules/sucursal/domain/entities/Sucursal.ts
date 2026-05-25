export interface Sucursal {
  suid: string;
  suemid: string;
  sunombre: string;
  sudireccion: string | null;
  sucorreo: string | null;
  suidentificador: string;
  sufchregistro: string;
  suestado: 'activo' | 'inactivo' | 'eliminado';
}

export interface PaginatedSucursales {
  items: Sucursal[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
