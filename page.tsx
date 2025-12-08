"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./src/components/features/auth/LoginForm.client";
import { AuthShell } from "./src/components/features/auth/AuthShell";
import { useAuth } from "./src/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const res = await auth.login({
      request: {
        email,
        password,
        remember_me: rememberMe,
      },
    });

    if (!res.success) {
      setError(res.message || "Login failed. Please try again.");
      return;
    }

    if (res.data?.requires_2fa) {
      router.push("/login/2fa");
      return;
    }

    if (res.data?.user.role === "user") {
      router.push("/profile-completion");
    } else {
      router.push("/dashboard/home");
    }
  };

  return (
    <AuthShell>
      <LoginForm
        email={email}
        password={password}
        rememberMe={rememberMe}
        error={error || auth.error || ''}
        isLoading={auth.isLoading}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onRememberMeChange={setRememberMe}
        onSubmit={handleSubmit}
        onSocialLogin={(provider) => console.log(`${provider} login not implemented`)}
        onSwitchToSignup={() => router.push("/register")}
        onForgotPassword={() => router.push("/forgot-password")}
      />
    </AuthShell>
  );
}
