export interface ProformaItemProducto {
  dprfmacodigo: string | null;
  dprfmadescripcion: string | null;
  dprfmacantidad: number;
  dprfmapreciounitario: number;
  dprfmapreciototal: number;
}

export interface ProformaDetalle {
  dprfmaid?: string;
  dprfmatipoitem: 'inventariable' | 'manual';
  producto: ProformaItemProducto;
}

export interface ProformaEmisor {
  empresa: { emid: string; emrznsocial: string; emcodigo: string; };
  sucursal: { suid: string; sunombre: string; suidentificador: string; };
  caja: { cjid: string; cjidentificador: string; };
  usuario: { usid: string; usnombre: string; };
}

export interface ProformaReceptor {
  clnteid: string;
  clntenombre: string;
  clnteidentificacion: string;
  clntecorreo?: string | null;
}

export interface ProformaTotal {
  prfmasubtotal: number;
  prfmadescuento: number;
  prfmatotal: number;
}

export interface Proforma {
  prfmaid: string;
  prfmaidentificador: string;
  prfmaestado: 'emitida' | 'pagada' | 'cancelada';
  prfmafchregistro: string;
  emisor: ProformaEmisor;
  receptor: ProformaReceptor;
  metodoPago: { mpid: string; mpnombre: string; };
  detalle: ProformaDetalle[];
  total: ProformaTotal;
}

export interface CreateProformaItemDTO {
  dprfmaesinventariable: boolean;
  dprfmacodigo?: string;
  dprfmadescripcion: string;
  dprfmacantidad: number;
  dprfmapreciounitario: number;
  dprfmapreciototal: number;
}

export interface CreateProformaDTO {
  prfmasuid: string;
  prfmacjid: string;
  prfmaclnteid: string;
  prfmampid: string;
  prfmasubtotal: number;
  prfmadescuento: number;
  prfmatotal: number;
  dprfmaproductos: CreateProformaItemDTO[];
}

export interface UpdateProformaItemDTO extends CreateProformaItemDTO {
  dprfmaid?: string;
}

export interface UpdateProformaDTO {
  prfmaclnteid: string;
  prfmampid: string;
  prfmasubtotal: number;
  prfmadescuento: number;
  prfmatotal: number;
  dprfmaproductos: UpdateProformaItemDTO[];
}
