export type CheckoutStatus = 'activo' | 'inactivo' | 'eliminado';

export interface CheckoutBranch {
  suid: string;
  sunombre: string;
  suidentificador: string;
  suestado: string;
}

export interface Checkout {
  cjid: string;
  cjemid: string;
  cjsuid: string;
  cjidentificador: string;
  cjfchregistro: string;
  cjestado: CheckoutStatus;
  sucursal?: CheckoutBranch; 
}

export interface PaginatedCheckouts {
  items: Checkout[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CreateCheckoutDto {
  cjemid: string;
  cjsuid: string;
  cjidentificador: string;
}

export interface UpdateCheckoutStatusDto {
  cjestado: CheckoutStatus;
}
