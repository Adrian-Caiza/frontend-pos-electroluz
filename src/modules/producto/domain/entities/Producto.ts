import type { Categoria } from '../../../categoria/domain/entities/Categoria';
import type { Marca } from '../../../marca/domain/entities/Marca';
import type { Proveedor } from '../../../proveedor/domain/entities/Proveedor';
import type { Medida } from '../../../medida/domain/entities/Medida';

export interface Producto {
  prdtoid: string;
  prdtoemid: string;
  categoria: Categoria | null;
  marca: Marca | null;
  proveedor: Proveedor | null;
  medida: Medida | null;
  prdtocodigo: string;
  prdtonombre: string;
  prdtopreciocompra: string;
  prdtoprecioventa: string;
  prdtostockminimo: string;
  prdtostockmaximo: string;
  prdtoimagen: string | null;
  prdtofchregistro: string;
  prdtoestado: 'activo' | 'inactivo' | 'eliminado';
}

export interface CreateProductoDto {
  prdtoemid: string;
  prdtoctgriaid: string;
  prdtomrcid: string;
  prdtoprovid: string;
  prdtomdiaid: string;
  prdtocodigo: string;
  prdtonombre: string;
  prdtopreciocompra: string;
  prdtoprecioventa: string;
  prdtostockminimo: string;
  prdtostockmaximo: string;
  imagen?: File;
}

export interface UpdateProductoDto {
  prdtoctgriaid?: string;
  prdtomrcid?: string;
  prdtoprovid?: string;
  prdtomdiaid?: string;
  prdtocodigo?: string;
  prdtonombre?: string;
  prdtopreciocompra?: string;
  prdtoprecioventa?: string;
  prdtostockminimo?: string;
  prdtostockmaximo?: string;
  prdtoestado?: 'activo' | 'inactivo' | 'eliminado';
  imagen?: File;
}
