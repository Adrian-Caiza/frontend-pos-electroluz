export interface Medida {
  mdiaid: string;
  mdiaemid: string;
  mdianombre: string;
  mdiaabreviatura: string;
  mdiafchregistro: string;
  mdiaestado: 'activo' | 'inactivo' | 'eliminado';
}

export type CreateMedidaDto = Omit<Medida, 'mdiaid' | 'mdiafchregistro' | 'mdiaestado'>;
export type UpdateMedidaDto = Partial<Omit<Medida, 'mdiaid' | 'mdiaemid' | 'mdiafchregistro'>>;
