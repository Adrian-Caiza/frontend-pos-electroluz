import type { IProformaRepository } from '../../domain/IProformaRepository';

export class PayProformaUseCase {
  private proformaRepository: IProformaRepository;

  constructor(proformaRepository: IProformaRepository) {
    this.proformaRepository = proformaRepository;
  }

  async execute(id: string): Promise<void> {
    return await this.proformaRepository.payProforma(id);
  }
}
