export interface Proveedor {
  provid: string;
  provemid: string;
  provnombre: string;
  provtelefono: string | null;
  provcorreo: string | null;
  categoria?: {
    ctgriaid: string;
    ctgnombre: string;
    ctgriadescripcion: string | null;
  } | null;
  marca?: {
    mrcid: string;
    mrcnombre: string;
  } | null;
  provfchregistro: string;
  provestado: 'activo' | 'inactivo' | 'eliminado';
}

export type CreateProveedorDto = {
  provemid: string;
  provnombre: string;
  provtelefono: string | null;
  provctgriaid?: string | null;
  provmrcid?: string | null;
  provcorreo?: string | null;
};

export type UpdateProveedorDto = Partial<Omit<CreateProveedorDto, 'provemid'>> & {
  provestado?: 'activo' | 'inactivo' | 'eliminado';
};
