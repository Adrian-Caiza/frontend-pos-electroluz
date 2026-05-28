import type { IMetodoPagoRepository } from '../../domain/IMetodoPagoRepository';
import type { MetodoPago } from '../../domain/MetodoPago';
import type { PaginatedResult } from '../../../../shared/types/PaginatedResult';

export class GetMetodosPagoUseCase {
  private metodoPagoRepository: IMetodoPagoRepository;

  constructor(metodoPagoRepository: IMetodoPagoRepository) {
    this.metodoPagoRepository = metodoPagoRepository;
  }

  async execute(page: number, pageSize: number): Promise<PaginatedResult<MetodoPago>> {
    return await this.metodoPagoRepository.getMetodosPago(page, pageSize);
  }
}
