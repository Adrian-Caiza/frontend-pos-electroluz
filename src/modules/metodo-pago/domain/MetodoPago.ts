export interface MetodoPago {
  mpid: string;
  mpemid: string;
  mpnombre: string;
  mpfchregistro: string;
  mpestado: 'activo' | 'inactivo';
}

export interface CreateMetodoPagoDTO {
  mpemid: string;
  mpnombre: string;
}

export interface UpdateMetodoPagoDTO {
  mpnombre?: string;
  mpestado?: 'activo' | 'inactivo';
}
