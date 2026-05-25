import type { PaginatedSucursales, Sucursal, CreateSucursalDto, UpdateSucursalDto } from '../entities/Sucursal';

export interface ISucursalRepository {
  getSucursales(page: number, pageSize: number): Promise<PaginatedSucursales>;
  createSucursal(data: CreateSucursalDto): Promise<Sucursal>;
  updateSucursal(id: string, data: UpdateSucursalDto): Promise<Sucursal>;
}
