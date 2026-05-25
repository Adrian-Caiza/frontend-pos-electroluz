export interface Medida {
  mdiaid: string;
  mdiaemid: string;
  mdianombre: string;
  mdiaabreviatura: string;
  mdiafchregistro: string;
  mdiaestado: 'activo' | 'inactivo' | 'eliminado';
}
