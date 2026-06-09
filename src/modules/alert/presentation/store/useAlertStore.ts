import { create } from 'zustand';
import type { Alert } from '../../domain/entities/Alert';

/** Stable key for a product-branch combination (survives backend alert re-creation) */
export function alertKey(alert: Alert): string {
  return `${alert.product?.id || ''}_${alert.branch?.id || ''}`;
}

interface AlertStore {
  unreadAlerts: Alert[];
  /** product_branch keys the user has explicitly dismissed (marked as read) */
  dismissedKeys: string[];
  addAlert: (alert: Alert) => void;
  setUnreadAlerts: (alerts: Alert[]) => void;
  removeUnreadAlert: (id: string) => void;
  /** Remove keys from dismissedKeys (when the product goes back above min stock) */
  undismissKeys: (keys: string[]) => void;
  clearUnreadAlerts: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  unreadAlerts: [],
  dismissedKeys: [],

  addAlert: (alert) => set((state) => {
    if (state.unreadAlerts.some(a => a.id === alert.id)) return state;
    return { unreadAlerts: [alert, ...state.unreadAlerts] };
  }),

  setUnreadAlerts: (alerts) => set({ unreadAlerts: alerts }),

  removeUnreadAlert: (id) => set((state) => {
    const alert = state.unreadAlerts.find(a => a.id === id);
    const key = alert ? alertKey(alert) : null;
    return {
      unreadAlerts: state.unreadAlerts.filter(a => a.id !== id),
      dismissedKeys: key && !state.dismissedKeys.includes(key)
        ? [...state.dismissedKeys, key]
        : state.dismissedKeys,
    };
  }),

  undismissKeys: (keys) => set((state) => ({
    dismissedKeys: state.dismissedKeys.filter(k => !keys.includes(k)),
  })),

  clearUnreadAlerts: () => set({ unreadAlerts: [], dismissedKeys: [] }),
}));
