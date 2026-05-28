import type { IMetodoPagoRepository } from '../../domain/IMetodoPagoRepository';
import type { MetodoPago, UpdateMetodoPagoDTO } from '../../domain/MetodoPago';

export class UpdateMetodoPagoUseCase {
  private metodoPagoRepository: IMetodoPagoRepository;

  constructor(metodoPagoRepository: IMetodoPagoRepository) {
    this.metodoPagoRepository = metodoPagoRepository;
  }

  async execute(id: string, data: UpdateMetodoPagoDTO): Promise<MetodoPago> {
    return await this.metodoPagoRepository.updateMetodoPago(id, data);
  }
}
