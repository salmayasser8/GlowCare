import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        Cookies.set("token", token, { expires: 7 });
        set({ token });
      },
      logout: () => {
        Cookies.remove("token");
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => {
        // safe for SSR - returns localStorage only on client
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
