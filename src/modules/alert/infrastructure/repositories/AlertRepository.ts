import type { IAlertRepository } from '../../domain/repositories/IAlertRepository';
import type { PaginatedAlerts } from '../../domain/entities/Alert';
import { alertApi } from '../services/alertApi';

export class AlertRepository implements IAlertRepository {
  async getAlerts(page: number, pageSize: number, suid?: string): Promise<PaginatedAlerts> {
    return alertApi.getAlerts(page, pageSize, suid);
  }

  async markAsViewed(id: string): Promise<{ message: string }> {
    return alertApi.markAsViewed(id);
  }
}
