import type { ISucursalRepository } from '../../domain/repositories/ISucursalRepository';
import type { Sucursal, CreateSucursalDto } from '../../domain/entities/Sucursal';

export class CreateSucursalUseCase {
  private sucursalRepository: ISucursalRepository;
  constructor(sucursalRepository: ISucursalRepository) {
    this.sucursalRepository = sucursalRepository;
  }

  execute(data: CreateSucursalDto): Promise<Sucursal> {
    return this.sucursalRepository.createSucursal(data);
  }
}
