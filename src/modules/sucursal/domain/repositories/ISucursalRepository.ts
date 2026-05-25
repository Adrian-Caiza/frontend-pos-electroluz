import type { PaginatedSucursales } from '../entities/Sucursal';

export interface ISucursalRepository {
  getSucursales(page: number, pageSize: number): Promise<PaginatedSucursales>;
}
