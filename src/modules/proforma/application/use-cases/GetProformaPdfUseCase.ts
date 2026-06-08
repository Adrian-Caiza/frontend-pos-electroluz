import type { IProformaRepository } from '../../domain/IProformaRepository';
import type { ProformaPdfResponse } from '../../domain/Proforma';

export class GetProformaPdfUseCase {
  private proformaRepository: IProformaRepository;

  constructor(proformaRepository: IProformaRepository) {
    this.proformaRepository = proformaRepository;
  }

  async execute(id: string): Promise<ProformaPdfResponse> {
    if (!id) {
      throw new Error('Proforma ID is required');
    }
    return await this.proformaRepository.getProformaPdf(id);
  }
}
