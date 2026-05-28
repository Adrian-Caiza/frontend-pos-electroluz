import { create } from 'zustand';

export interface CartItem {
  id: string; // unique local ID (could be product ID or a random UUID for manual items)
  esInventariable: boolean;
  codigo?: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  precioTotal: number;
}

interface TerminalCartState {
  items: CartItem[];
  subtotal: number;
  descuento: number;
  total: number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'precioTotal'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, cantidad: number) => void;
  setDescuento: (descuento: number) => void;
  clearCart: () => void;
}

export const useTerminalCart = create<TerminalCartState>((set, get) => ({
  items: [],
  subtotal: 0,
  descuento: 0,
  total: 0,

  addItem: (newItem) => {
    set((state) => {
      // Check if inventariable item already exists, just increase quantity
      if (newItem.esInventariable) {
        const existingItemIndex = state.items.findIndex(i => i.id === newItem.id && i.esInventariable);
        if (existingItemIndex >= 0) {
          const updatedItems = [...state.items];
          const item = updatedItems[existingItemIndex];
          const newQuantity = item.cantidad + newItem.cantidad;
          updatedItems[existingItemIndex] = {
            ...item,
            cantidad: newQuantity,
            precioTotal: Number((newQuantity * item.precioUnitario).toFixed(2))
          };
          
          const newSubtotal = updatedItems.reduce((acc, curr) => acc + curr.precioTotal, 0);
          return {
            items: updatedItems,
            subtotal: newSubtotal,
            total: Number((newSubtotal - state.descuento).toFixed(2))
          };
        }
      }

      // Add new item
      const itemWithTotal = {
        ...newItem,
        precioTotal: Number((newItem.cantidad * newItem.precioUnitario).toFixed(2))
      };
      const updatedItems = [...state.items, itemWithTotal];
      const newSubtotal = updatedItems.reduce((acc, curr) => acc + curr.precioTotal, 0);
      
      return {
        items: updatedItems,
        subtotal: newSubtotal,
        total: Number((newSubtotal - state.descuento).toFixed(2))
      };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const updatedItems = state.items.filter(i => i.id !== id);
      const newSubtotal = updatedItems.reduce((acc, curr) => acc + curr.precioTotal, 0);
      
      return {
        items: updatedItems,
        subtotal: newSubtotal,
        total: Number((Math.max(0, newSubtotal - state.descuento)).toFixed(2))
      };
    });
  },

  updateQuantity: (id, cantidad) => {
    set((state) => {
      if (cantidad <= 0) return state;

      const updatedItems = state.items.map(i => {
        if (i.id === id) {
          return {
            ...i,
            cantidad,
            precioTotal: Number((cantidad * i.precioUnitario).toFixed(2))
          };
        }
        return i;
      });

      const newSubtotal = updatedItems.reduce((acc, curr) => acc + curr.precioTotal, 0);
      
      return {
        items: updatedItems,
        subtotal: newSubtotal,
        total: Number((Math.max(0, newSubtotal - state.descuento)).toFixed(2))
      };
    });
  },

  setDescuento: (descuento) => {
    set((state) => ({
      descuento,
      total: Number((Math.max(0, state.subtotal - descuento)).toFixed(2))
    }));
  },

  clearCart: () => set({ items: [], subtotal: 0, descuento: 0, total: 0 })
}));
