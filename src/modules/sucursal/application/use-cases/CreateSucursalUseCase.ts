import type { ISucursalRepository } from '../../domain/repositories/ISucursalRepository';
import type { Sucursal, CreateSucursalDto } from '../../domain/entities/Sucursal';

export class CreateSucursalUseCase {
  constructor(private sucursalRepository: ISucursalRepository) {}

  execute(data: CreateSucursalDto): Promise<Sucursal> {
    return this.sucursalRepository.createSucursal(data);
  }
}
