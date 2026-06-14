import { create } from 'zustand';
import type { Alert } from '../../domain/entities/Alert';

/** Stable key for a product-branch combination (survives backend alert re-creation) */
export function alertKey(alert: Alert): string {
  return `${alert.product?.id || ''}_${alert.branch?.id || ''}`;
}

interface AlertStore {
  unreadAlerts: Alert[];
  addAlert: (alert: Alert) => void;
  setUnreadAlerts: (alerts: Alert[]) => void;
  removeUnreadAlert: (id: string) => void;
  clearUnreadAlerts: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  unreadAlerts: [],

  addAlert: (alert) => set((state) => {
    const key = alertKey(alert);
    // Replace any existing alert for the same product+branch.
    // The backend recreates alerts every ~5 min with new alid values,
    // so we replace by product+branch key to keep the latest alid.
    const filtered = state.unreadAlerts.filter(a => alertKey(a) !== key);
    return { unreadAlerts: [alert, ...filtered] };
  }),

  setUnreadAlerts: (alerts) => set({ unreadAlerts: alerts }),

  removeUnreadAlert: (id) => set((state) => ({
    unreadAlerts: state.unreadAlerts.filter(a => a.id !== id),
  })),

  clearUnreadAlerts: () => set({ unreadAlerts: [] }),
}));