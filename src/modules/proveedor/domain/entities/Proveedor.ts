export interface Proveedor {
  provid: string;
  provemid: string;
  provnombre: string;
  provtelefono: string | null;
  provcorreo: string | null;
  provfchregistro: string;
  provestado: 'activo' | 'inactivo' | 'eliminado';
}
