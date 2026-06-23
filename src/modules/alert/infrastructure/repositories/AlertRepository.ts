import type { IAlertRepository } from '../../domain/repositories/IAlertRepository';
import type { PaginatedAlerts, AlertSummary } from '../../domain/entities/Alert';
import { alertApi } from '../services/alertApi';

export class AlertRepository implements IAlertRepository {
  async getAlerts(page: number, pageSize: number, opts?: { suid?: string; visible?: boolean; visto?: boolean; tipo?: string }): Promise<PaginatedAlerts> {
    return alertApi.getAlerts(page, pageSize, opts);
  }

  async getSummary(): Promise<AlertSummary> {
    return alertApi.getSummary();
  }

  async markAsViewed(id: string): Promise<{ message: string }> {
    return alertApi.markAsViewed(id);
  }
}
