import type { IMetodoPagoRepository } from '../../domain/IMetodoPagoRepository';
import type { MetodoPago, CreateMetodoPagoDTO } from '../../domain/MetodoPago';

export class CreateMetodoPagoUseCase {
  private metodoPagoRepository: IMetodoPagoRepository;

  constructor(metodoPagoRepository: IMetodoPagoRepository) {
    this.metodoPagoRepository = metodoPagoRepository;
  }

  async execute(data: CreateMetodoPagoDTO): Promise<MetodoPago> {
    return await this.metodoPagoRepository.createMetodoPago(data);
  }
}
