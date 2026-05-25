import type { ISucursalRepository } from '../../domain/repositories/ISucursalRepository';
import type { PaginatedSucursales } from '../../domain/entities/Sucursal';

export class GetSucursalesUseCase {
  constructor(private sucursalRepository: ISucursalRepository) {}

  execute(page: number, pageSize: number): Promise<PaginatedSucursales> {
    return this.sucursalRepository.getSucursales(page, pageSize);
  }
}
