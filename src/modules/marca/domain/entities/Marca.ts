export interface Marca {
  mrcid: string;
  mrcemid: string;
  mrcnombre: string;
  mrcfchregistro: string;
  mrcestado: 'activo' | 'inactivo' | 'eliminado';
}

export interface CreateMarcaDto {
  mrcemid: string;
  mrcnombre: string;
}

export interface UpdateMarcaDto {
  mrcnombre?: string;
  mrcestado?: 'activo' | 'inactivo' | 'eliminado';
}
