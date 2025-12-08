export const REDIRECT_ROUTES = {
  ADMIN: "/dashboard/admin",
  PROFESSIONAL: "/dashboard/professional",
  STUDENT: "/dashboard/student",
  USER: "/profile-completion",
} as const;

export const PUBLIC_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
} as const;

export const COMMON_ROUTES = {
  SETTINGS: "/settings",
  WRITING_SECTION: "/writing-section",
  BLOG_READING: "/blog-reading",
  PROFILE_COMPLETION: "/profile-completion",
  HELP: "/help",
  ANOTATE_FILE: "/anotate",
} as const;

export const PROFESSIONAL_ROUTES = {
  PROFESSIONAL_DASHBOARD: "/dashboard/professional",
  PROFESSIONAL_PROFILE: "/dashboard/professional/profile",
  PROFESSIONAL_APPLICATIONS: "/dashboard/professional/applications",
  PROFESSIONAL_APPLY_CREATOR: "/creator-application",
  PROFESSIONAL_LIBRARY: "/dashboard/professional/library",
  PROFESSIONAL_DOCUMENTS: "/dashboard/professional/documents",
  PROFESSIONAL_REFERENCE_MANAGER: "/dashboard/professional/reference-manager",
} as const;

export const STUDENT_ROUTES = {
  STUDENT_DASHBOARD: "/dashboard/student",
  STUDENT_PROFILE: "/dashboard/student/profile",
  STUDENT_APPLICATIONS: "/dashboard/student/applications",
  STUDENT_APPLY_CREATOR: "/creator-application",
  STUDENT_LIBRARY: "/dashboard/student/library",
  STUDENT_DOCUMENTS: "/dashboard/student/documents",
  STUDENT_SUBSCRIPTION: "/dashboard/student/subscription",
  STUDENT_REFERENCE_MANAGER: "/dashboard/student/reference-manager",
} as const;

export const ADMIN_ROUTES = {
  ADMIN_DASHBOARD: "/dashboard/admin",
  ADMIN_APPLICATIONS: "/dashboard/admin/applications",
  ADMIN_PROFILE: "/dashboard/admin/profile",
  ADMIN_USERS: "/dashboard/admin/users",
  ADMIN_LOGS: "/admin/logs",
  ADMIN_SYSTEM: "/admin/system",
  ADMIN_LIBRARY: "/dashboard/admin/library",
  ADMIN_DOCUMENTS: "/dashboard/admin/documents",
  ADMIN_WORKSPACE: "/dashboard/admin/workspace",
} as const;

export const API_ENDPOINTS = {
  PREREGISTER: `api/auth/check-preregister`,
  SIGNUP: `api/auth/signup`,
  LOGIN: `api/auth/login`,
  LOGOUT: `api/auth/logout`,
  LOGOUT_ALL: `api/auth/logout-all`,
  VERIFY_OTP: `api/auth/verify-otp`,
  FORGOT_PASSWORD: `api/auth/forgot-password`,
  RESET_PASSWORD: `api/auth/reset-password`,
  CHANGE_PASSWORD: `api/auth/change-password`,
  REFRESH_TOKEN: `api/auth/refresh`,
  ENABLE_2FA: `api/auth/enable-2fa`,
  DISABLE_2FA: `api/auth/disable-2fa`,
  VERIFY_2FA: `api/auth/verify-2fa`,
  SESSIONS: `api/auth/sessions`,
  UPDATE_SETTINGS: `api/users/profile`,
  GET_SETTINGS: `api/users/profile`,
  GOOGLE_AUTH_URL: `api/auth/google/url`,
  GOOGLE_CALLBACK: `api/auth/google/callback`,
  ME: `api/users/profile`,
  UPDATE_PROFILE: `api/users/profile`,
  USER_SETUP: `api/users/profile`,
  ACCOUNT_DELETE: `api/users/account`,
};
