import { useAuthStore } from "../store/slices/auth.slice";

export function useAuth() {
  return useAuthStore();
}

// Re-export AuthProvider from useAuth.client.tsx for backward compatibility
export { AuthProvider } from "./useAuth.client";
