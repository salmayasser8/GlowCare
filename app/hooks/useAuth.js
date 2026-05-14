import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function useAuth(requiredRole = null) {
  const [mounted, setMounted] = useState(false);
  const { user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      router.push("/login");
      return;
    }
    if (requiredRole && user?.role !== requiredRole) router.push("/");
  }, [mounted, token, user]);

  return { user, token, mounted };
}
