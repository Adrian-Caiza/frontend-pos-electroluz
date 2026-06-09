import { create } from 'zustand';
import type { Alert } from '../../domain/entities/Alert';

interface AlertStore {
  unreadAlerts: Alert[];
  viewedAlertIds: string[]; // To track alerts we've already marked as read
  addAlert: (alert: Alert) => void;
  setUnreadAlerts: (alerts: Alert[]) => void;
  removeUnreadAlert: (id: string) => void;
  unmarkViewed: (id: string) => void;
  clearUnreadAlerts: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  unreadAlerts: [],
  viewedAlertIds: [],
  addAlert: (alert) => set((state) => {
    // Avoid duplicates if we receive the same event
    if (state.unreadAlerts.some(a => a.id === alert.id)) return state;
    return { unreadAlerts: [alert, ...state.unreadAlerts] };
  }),
  setUnreadAlerts: (alerts) => set({ unreadAlerts: alerts }),
  removeUnreadAlert: (id) => set((state) => ({
    unreadAlerts: state.unreadAlerts.filter(a => a.id !== id),
    viewedAlertIds: [...state.viewedAlertIds, id] // Remember that we viewed this
  })),
  unmarkViewed: (id) => set((state) => ({
    viewedAlertIds: state.viewedAlertIds.filter(vid => vid !== id),
  })),
  clearUnreadAlerts: () => set({ unreadAlerts: [], viewedAlertIds: [] })
}));
