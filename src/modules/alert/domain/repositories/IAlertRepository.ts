import type { Alert, PaginatedAlerts } from '../entities/Alert';

export interface IAlertRepository {
  getAlerts(page: number, pageSize: number, suid?: string): Promise<PaginatedAlerts>;
  markAsViewed(id: string): Promise<{ message: string }>;
}
