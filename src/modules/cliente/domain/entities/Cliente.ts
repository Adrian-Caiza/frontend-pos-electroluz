export interface Cliente {
  clnteid: string;
  clnteemid: string;
  clntetipoidentificacion: 'cedula' | 'ruc';
  clnteidentificacion: string;
  clntenombre: string;
  clntecorreo: string;
  clntedireccion: string;
  clntetelefono: string;
  clntefchregistro: string;
  clnteestado: 'activo' | 'inactivo' | 'eliminado';
}

export interface PaginatedClientes {
  items: Cliente[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CreateClienteDto {
  clnteemid: string;
  clntetipoidentificacion: 'cedula' | 'ruc';
  clnteidentificacion: string;
  clntenombre: string;
  clntecorreo: string;
  clntedireccion: string;
  clntetelefono: string;
}

export interface UpdateClienteDto {
  clntetipoidentificacion?: 'cedula' | 'ruc';
  clnteidentificacion?: string;
  clntenombre?: string;
  clntecorreo?: string;
  clntedireccion?: string;
  clntetelefono?: string;
  clnteestado?: 'activo' | 'inactivo' | 'eliminado';
}
