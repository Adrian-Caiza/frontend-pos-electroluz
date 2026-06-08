import { create } from 'zustand';
import type { Alert } from '../../domain/entities/Alert';

interface AlertStore {
  unreadAlerts: Alert[];
  addAlert: (alert: Alert) => void;
  removeUnreadAlert: (id: string) => void;
  clearUnreadAlerts: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  unreadAlerts: [],
  addAlert: (alert) => set((state) => {
    // Avoid duplicates if we receive the same event
    if (state.unreadAlerts.some(a => a.alid === alert.alid)) return state;
    return { unreadAlerts: [alert, ...state.unreadAlerts] };
  }),
  removeUnreadAlert: (id) => set((state) => ({
    unreadAlerts: state.unreadAlerts.filter(a => a.alid !== id)
  })),
  clearUnreadAlerts: () => set({ unreadAlerts: [] })
}));
