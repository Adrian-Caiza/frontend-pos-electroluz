export interface Marca {
  mrcid: string;
  mrcemid: string;
  mrcnombre: string;
  mrcfchregistro: string;
  mrcestado: 'activo' | 'inactivo' | 'eliminado';
}
