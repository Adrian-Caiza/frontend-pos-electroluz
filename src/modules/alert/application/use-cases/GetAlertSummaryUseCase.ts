import type { IAlertRepository } from '../../domain/repositories/IAlertRepository';
import type { AlertSummary } from '../../domain/entities/Alert';

export class GetAlertSummaryUseCase {
  private readonly repository: IAlertRepository;

  constructor(repository: IAlertRepository) {
    this.repository = repository;
  }

  async execute(): Promise<AlertSummary> {
    return this.repository.getSummary();
  }
}
