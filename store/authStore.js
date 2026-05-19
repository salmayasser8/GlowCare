import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (user) => set({ user }),
      setToken: (token, rememberMe = false) => {
        if (rememberMe) {
          Cookies.set("token", token, { expires: 7 });
          localStorage.setItem("rememberMe", "true");
        } else {
          Cookies.set("token", token);
          localStorage.removeItem("rememberMe");
        }
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
        if (typeof window !== "undefined") {
          const rememberMe = localStorage.getItem("rememberMe");
          return rememberMe ? localStorage : sessionStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    },
  ),
);
