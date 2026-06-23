import type { IAlertRepository } from '../../domain/repositories/IAlertRepository';
import type { PaginatedAlerts } from '../../domain/entities/Alert';

export class GetAlertsUseCase {
  private readonly repository: IAlertRepository;

  constructor(repository: IAlertRepository) {
    this.repository = repository;
  }

  async execute(page: number, pageSize: number, opts?: { suid?: string; visible?: boolean; visto?: boolean; tipo?: string }): Promise<PaginatedAlerts> {
    return this.repository.getAlerts(page, pageSize, opts);
  }
}
