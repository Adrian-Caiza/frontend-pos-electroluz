import type { ISucursalRepository } from '../../domain/repositories/ISucursalRepository';
import type { Sucursal, UpdateSucursalDto } from '../../domain/entities/Sucursal';

export class UpdateSucursalUseCase {
  constructor(private sucursalRepository: ISucursalRepository) {}

  execute(id: string, data: UpdateSucursalDto): Promise<Sucursal> {
    return this.sucursalRepository.updateSucursal(id, data);
  }
}
