import type { Alert, PaginatedAlerts, AlertSummary } from '../entities/Alert';

export interface IAlertRepository {
  getAlerts(page: number, pageSize: number, opts?: { suid?: string; visible?: boolean; visto?: boolean; tipo?: string }): Promise<PaginatedAlerts>;
  getSummary(): Promise<AlertSummary>;
  markAsViewed(id: string): Promise<{ message: string }>;
}
