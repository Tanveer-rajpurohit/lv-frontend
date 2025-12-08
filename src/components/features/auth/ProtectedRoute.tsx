"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import type { UserRole } from "../../../types/auth.types";
import Loader from "../../ui/Loader";
import { useAuth } from "../../../hooks/useAuth";
import {
  PUBLIC_ROUTES,
  ADMIN_ROUTES,
  COMMON_ROUTES,
  PROFESSIONAL_ROUTES,
  STUDENT_ROUTES,
  REDIRECT_ROUTES,
} from "../../../constants/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { profile, isInitialLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check route types with proper subroute handling
  const isPublicRoute = useMemo(
    () => Object.values(PUBLIC_ROUTES).some((route) => pathname === route),
    [pathname]
  );

  const isCommonRoute = useMemo(
    () =>
      Object.values(COMMON_ROUTES).some((route) => pathname.startsWith(route)),
    [pathname]
  );

  const isAdminRoute = useMemo(
    () =>
      Object.values(ADMIN_ROUTES).some((route) => pathname.startsWith(route)),
    [pathname]
  );

  const isProfessionalRoute = useMemo(
    () =>
      Object.values(PROFESSIONAL_ROUTES).some((route) =>
        pathname.startsWith(route)
      ),
    [pathname]
  );

  const isStudentRoute = useMemo(
    () =>
      Object.values(STUDENT_ROUTES).some((route) => pathname.startsWith(route)),
    [pathname]
  );

  // Check if current route requires authentication
  const requiresAuth = useMemo(() => {
    return !isPublicRoute;
  }, [isPublicRoute]);

  // Check if user has access to current route
  const hasAccess = useMemo(() => {
    if (isPublicRoute) return true;

    // If user is not logged in, only public routes are accessible
    if (!isAuthenticated || !profile) return false;

    // Common routes are accessible to all authenticated users
    if (isCommonRoute) return true;

    // Role-based route access based on current path
    switch (profile.role) {
      case "admin":
        // Admin can access all routes
        return true;

      case "professional":
        // Professional can access professional routes
        return isProfessionalRoute;

      case "student":
        // Student can access student routes (mirrors user routes)
        return isStudentRoute;

      default:
        return false;
    }
  }, [
    profile,
    pathname,
    isPublicRoute,
    isCommonRoute,
    isAdminRoute,
    isProfessionalRoute,
    isStudentRoute,
  ]);

  // Get appropriate redirect route based on user role
  const getRedirectRoute = (userRole: UserRole): string => {
    const defaultRoutes: Record<UserRole, string> = {
      admin: ADMIN_ROUTES.ADMIN_DASHBOARD,
      professional: PROFESSIONAL_ROUTES.PROFESSIONAL_DASHBOARD,
      student: STUDENT_ROUTES.STUDENT_DASHBOARD,
      user: REDIRECT_ROUTES.USER,
    };
    return defaultRoutes[userRole] || PUBLIC_ROUTES.LOGIN;
  };

  // Handle redirects
  useEffect(() => {
    if (isInitialLoading) return;

    if (!isAuthenticated && requiresAuth) {
      router.replace(PUBLIC_ROUTES.LOGIN);
      return;
    }

    // Redirect authenticated users away from auth pages
    if (
      isAuthenticated &&
      profile &&
      isPublicRoute &&
      (pathname === PUBLIC_ROUTES.LOGIN || pathname === PUBLIC_ROUTES.REGISTER)
    ) {
      router.replace(getRedirectRoute(profile.role));
      return;
    }

    // Redirect if user doesn't have access to current route
    if (isAuthenticated && profile && !hasAccess && !isPublicRoute) {
      router.replace(getRedirectRoute(profile.role));
      return;
    }
  }, [profile, pathname, hasAccess, router, isInitialLoading, requiresAuth]);

  if (isInitialLoading) {
    return <Loader message="Loading..." />;
  }
  if (requiresAuth && !isAuthenticated) {
    return <Loader message="Redirecting to login..." />;
  }
  if (profile && !hasAccess && !isPublicRoute) {
    return <Loader message="Redirecting..." />;
  }

  return <>{children}</>;
}