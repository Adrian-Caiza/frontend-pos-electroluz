import type { IProformaRepository } from '../../domain/IProformaRepository';
import type { Proforma, CreateProformaDTO } from '../../domain/Proforma';

export class CreateProformaUseCase {
  private proformaRepository: IProformaRepository;

  constructor(proformaRepository: IProformaRepository) {
    this.proformaRepository = proformaRepository;
  }

  async execute(data: CreateProformaDTO): Promise<Proforma> {
    return await this.proformaRepository.createProforma(data);
  }
}
