import { create } from 'zustand';
import type { Producto } from '../../domain/entities/Producto';

interface ProductoStore {
  selectedProduct: Producto | null;
  isDetailOpen: boolean;
  openDetail: (product: Producto) => void;
  closeDetail: () => void;
  setSelectedProduct: (product: Producto | null) => void;
}

export const useProductoStore = create<ProductoStore>((set) => ({
  selectedProduct: null,
  isDetailOpen: false,
  openDetail: (product) => set({ selectedProduct: product, isDetailOpen: true }),
  closeDetail: () => set({ isDetailOpen: false, selectedProduct: null }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
}));
