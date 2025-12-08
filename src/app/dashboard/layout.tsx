"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/src/store/slices/auth.slice";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isInitialLoading, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth when dashboard loads
    if (isInitialLoading) {
      initialize();
    }
  }, [isInitialLoading, initialize]);

  return <>{children}</>;
}

