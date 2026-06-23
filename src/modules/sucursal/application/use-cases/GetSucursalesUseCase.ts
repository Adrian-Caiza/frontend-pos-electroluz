import type { ISucursalRepository } from '../../domain/repositories/ISucursalRepository';
import type { PaginatedSucursales } from '../../domain/entities/Sucursal';

export class GetSucursalesUseCase {
  private sucursalRepository: ISucursalRepository;
  constructor(sucursalRepository: ISucursalRepository) {
    this.sucursalRepository = sucursalRepository;
  }

  execute(page: number, pageSize: number, search?: string, status?: string): Promise<PaginatedSucursales> {
    return this.sucursalRepository.getSucursales(page, pageSize, search, status);
  }
}
