import { create } from 'zustand';
import type { Alert } from '../../domain/entities/Alert';


function alertKey(alert: Alert): string {
  return `${alert.product?.id || ''}_${alert.branch?.id || ''}`;
}

interface AlertStore {
  
  unseenCount: number;
  setUnseenCount: (count: number) => void;
  incrementUnseen: () => void;
  decrementUnseen: () => void;

  
  bellAlerts: Alert[];
  setBellAlerts: (alerts: Alert[]) => void;
  addBellAlert: (alert: Alert) => void;
  updateBellAlert: (alert: Alert) => void;
  removeBellAlert: (id: string) => void;
  clearBellAlerts: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  unseenCount: 0,
  setUnseenCount: (count) => set({ unseenCount: Math.max(0, count) }),
  incrementUnseen: () => set((state) => ({ unseenCount: state.unseenCount + 1 })),
  decrementUnseen: () => set((state) => ({ unseenCount: Math.max(0, state.unseenCount - 1) })),

  bellAlerts: [],

  setBellAlerts: (alerts) => set({ bellAlerts: alerts }),

  addBellAlert: (newAlert) => set((state) => {
    
    const exists = state.bellAlerts.some(a => a.id === newAlert.id);
    if (exists) {
      return { bellAlerts: state.bellAlerts.map(a => a.id === newAlert.id ? newAlert : a) };
    }
    
    return { bellAlerts: [newAlert, ...state.bellAlerts] };
  }),

  updateBellAlert: (updatedAlert) => set((state) => ({
    bellAlerts: state.bellAlerts.map(a => a.id === updatedAlert.id ? updatedAlert : a)
  })),

  removeBellAlert: (id) => set((state) => ({
    bellAlerts: state.bellAlerts.filter(a => a.id !== id),
  })),

  clearBellAlerts: () => set({ bellAlerts: [] }),
}));