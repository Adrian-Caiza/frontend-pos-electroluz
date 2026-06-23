import type { IProformaRepository } from '../../domain/IProformaRepository';
import type { Proforma } from '../../domain/Proforma';
import type { PaginatedResult } from '../../../../shared/types/PaginatedResult';

export class GetProformasUseCase {
  private proformaRepository: IProformaRepository;

  constructor(proformaRepository: IProformaRepository) {
    this.proformaRepository = proformaRepository;
  }

  async execute(page: number, pageSize: number, search?: string, status?: string): Promise<PaginatedResult<Proforma>> {
    return await this.proformaRepository.getProformas(page, pageSize, search, status);
  }
}
