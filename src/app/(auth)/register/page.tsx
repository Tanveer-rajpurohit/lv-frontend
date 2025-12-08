"use client";

import RegistrationPage from "../../../components/features/auth/Signup.client";
import { AuthProvider } from "../../../hooks/useAuth";

export default function RegisterPage() {
  return (
    <AuthProvider>
      <RegistrationPage />
    </AuthProvider>
  );
}
