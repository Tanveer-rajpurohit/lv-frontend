import { useAuthStore } from "../store/slices/auth.slice";

export function useAuth() {
  return useAuthStore();
}
