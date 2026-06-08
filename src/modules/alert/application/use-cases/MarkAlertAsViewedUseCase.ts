import type { IAlertRepository } from '../../domain/repositories/IAlertRepository';

export class MarkAlertAsViewedUseCase {
  private readonly repository: IAlertRepository;

  constructor(repository: IAlertRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<{ message: string }> {
    return this.repository.markAsViewed(id);
  }
}
