import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart: { items: [] },
  setCart: (cart) => set({ cart }),
  clearCart: () => set({ cart: { items: [] } }),
}));
