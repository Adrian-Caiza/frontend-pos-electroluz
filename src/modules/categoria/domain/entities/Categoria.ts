export interface Categoria {
  ctgriaid: string;
  ctgriaemid: string;
  ctgnombre: string;
  ctgriadescripcion: string | null;
  ctgriafchregistro: string;
  ctgriaestado: 'activo' | 'inactivo' | 'eliminado';
}
