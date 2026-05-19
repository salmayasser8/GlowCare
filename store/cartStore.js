import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
export const useCartStore = create(
  persist(
    (set) => ({
      cart: { items: [] },
      setCart: (cart) => set({ cart }),
      clearCart: () => set({ cart: { items: [] } }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    },
  ),
);
