export interface Alert {
  id: string;
  type: string;
  message: string;
  isViewed: boolean;
  createdAt: string;
  updatedAt?: string;
  currentQuantity?: number;
  minStock?: number;
  maxStock?: number;
  branch?: {
    id: string;
    name: string;
    code: string;
  };
  product?: {
    id: string;
    code: string;
    name: string;
  };
}

export interface PaginatedAlerts {
  items: Alert[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface AlertSummary {
  totalVisible: number;
  totalUnseen: number;
  byType: { type: string; totalVisible: number; totalUnseen: number }[];
  byBranch: { suid: string; sunombre: string; suidentificador: string; totalVisible: number; totalUnseen: number }[];
}
