import { create } from 'zustand';

export interface CartItem {
  id: string; 
  dprfmaid?: string; 
  esInventariable: boolean;
  codigo?: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  precioTotal: number;
  stockMaximo?: number; 
}

interface TerminalCartState {
  items: CartItem[];
  subtotal: number;
  descuento: number;
  total: number;
  
  
  addItem: (item: Omit<CartItem, 'precioTotal'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, cantidad: number) => void;
  setDescuento: (descuento: number) => void;
  clearCart: () => void;
  loadProforma: (proforma: import('../../domain/Proforma').Proforma) => void;
}

export const useTerminalCart = create<TerminalCartState>((set, get) => ({
  items: [],
  subtotal: 0,
  descuento: 0,
  total: 0,

  addItem: (newItem) => {
    set((state) => {
      
      if (newItem.esInventariable) {
        const existingItemIndex = state.items.findIndex(i => i.id === newItem.id && i.esInventariable);
        if (existingItemIndex >= 0) {
          const updatedItems = [...state.items];
          const item = updatedItems[existingItemIndex];
          
          let newQuantity = item.cantidad + newItem.cantidad;
          if (item.stockMaximo !== undefined && newQuantity > item.stockMaximo) {
            newQuantity = item.stockMaximo;
          }

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

      
      let initialQuantity = newItem.cantidad;
      if (newItem.stockMaximo !== undefined && initialQuantity > newItem.stockMaximo) {
        initialQuantity = newItem.stockMaximo;
      }
      
      const itemWithTotal = {
        ...newItem,
        cantidad: initialQuantity,
        precioTotal: Number((initialQuantity * newItem.precioUnitario).toFixed(2))
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
          let newQuantity = cantidad;
          if (i.stockMaximo !== undefined && newQuantity > i.stockMaximo) {
            newQuantity = i.stockMaximo;
          }
          return {
            ...i,
            cantidad: newQuantity,
            precioTotal: Number((newQuantity * i.precioUnitario).toFixed(2))
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

  clearCart: () => set({ items: [], subtotal: 0, descuento: 0, total: 0 }),
  
  loadProforma: (proforma) => {
    const items: CartItem[] = proforma.detalle.map(d => ({
      id: d.producto.dprfmacodigo || d.dprfmaid || crypto.randomUUID(),
      dprfmaid: d.dprfmaid,
      esInventariable: d.dprfmatipoitem === 'inventariable',
      codigo: d.producto.dprfmacodigo || undefined,
      descripcion: d.producto.dprfmadescripcion || '',
      cantidad: d.producto.dprfmacantidad,
      precioUnitario: d.producto.dprfmapreciounitario,
      precioTotal: d.producto.dprfmapreciototal
    }));
    
    set({
      items,
      subtotal: proforma.total.prfmasubtotal,
      descuento: proforma.total.prfmadescuento,
      total: proforma.total.prfmatotal
    });
  }
}));
