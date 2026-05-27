export interface Usuario {
  usid: string;
  usemid: string;
  usnombre: string;
  usapodo: string;
  uscorreo: string;
  usimagen: string | null;
  usrol: 'administrador' | 'jefe' | 'empleado';
  usfchregistro: string;
  usestado: 'activo' | 'inactivo' | 'eliminado';
}

export interface PaginatedUsuarios {
  items: Usuario[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CreateUsuarioDto {
  usemid: string;
  usnombre: string;
  usapodo: string;
  uscorreo: string;
  uspassword?: string;
  usrol: 'jefe' | 'empleado';
  imagen?: File;
}

export interface UpdateUsuarioDto {
  usnombre?: string;
  uscorreo?: string;
  usestado?: 'activo' | 'inactivo' | 'eliminado';
  usrol?: 'jefe' | 'empleado';
  imagen?: File;
}

export interface UpdateUsuarioStatusDto {
  usemid: string;
  usestado: 'activo' | 'inactivo' | 'eliminado';
}
