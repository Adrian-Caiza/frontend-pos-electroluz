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
  sucursal?: CheckoutBranch; // Only present in GET endpoints, not in POST response usually, but we make it optional
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
