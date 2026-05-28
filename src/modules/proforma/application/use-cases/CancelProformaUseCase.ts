import type { IProformaRepository } from '../../domain/IProformaRepository';

export class CancelProformaUseCase {
  private proformaRepository: IProformaRepository;

  constructor(proformaRepository: IProformaRepository) {
    this.proformaRepository = proformaRepository;
  }

  async execute(id: string): Promise<void> {
    return await this.proformaRepository.cancelProforma(id);
  }
}
