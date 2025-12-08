"use client";

import LoginClientPage from "../../../components/features/auth/Login.client";
import { AuthProvider } from "../../../hooks/useAuth";

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginClientPage />
    </AuthProvider>
  );
}
