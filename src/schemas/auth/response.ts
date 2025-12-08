import { z } from "zod";

enum AuthProvider {
  EMAIL = "email",
  GOOGLE = "google",
}

enum UserRole {
  ADMIN = "admin",
  PROFESSIONAL = "professional",
  STUDENT = "student",
  USER = "user",
}

export const AuthProviderEnum = z.enum([
  AuthProvider.EMAIL,
  AuthProvider.GOOGLE,
]);

export const UserRoleEnum = z.enum([
  UserRole.ADMIN,
  UserRole.PROFESSIONAL,
  UserRole.STUDENT,
  UserRole.USER,
]);

export const ApplicationStatusEnum = z.enum([
  "pending",
  "approved",
  "rejected",
  "flagged",
]);

export const userSchema = z.object({
  user_id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  username: z.string().optional(),
  picture: z.string().url().optional(),
  provider: AuthProviderEnum.optional(),
  role: UserRoleEnum,
  is_verified: z.boolean().optional(),
  two_fa_enabled: z.boolean().optional(),
  is_profile_complete: z.boolean().optional(),
  created_at: z.string().optional(),
  last_login: z.string().optional(),
});

export const userProfileSchema = z.object({
  risk_score: z.number(),
  spam_score: z.number(),
  profile_score: z.number(),
  bio: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  date_of_birth: z.string().nullable().optional(),
  interests: z.array(z.string()),
  profession: z.string().nullable().optional(),
  education: z.string().nullable().optional(),
  year_of_passing: z.string().nullable().optional(),
  is_profile_public: z.boolean(),
  two_fa_enabled: z.boolean(),
  user_id: z.string(),
  email: z.string().email(),
  username: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  picture: z.string().url().nullable().optional(),
  role: UserRoleEnum,
  status: z.string(),
  provider: AuthProviderEnum.optional(),
  is_profile_complete: z.boolean(),
  created_at: z.string(),
  last_login: z.string(),
  isverified_creator: z.boolean().optional(),
  creator_bio: z.string().optional(),
  creator_category: z.string().optional(),
  creator_experience_years: z.number().optional(),
  creator_portfolio_url: z.string().url().optional(),
  creator_approved_at: z.string().optional(),
});

export const publicUserProfileSchema = z.object({
  user_id: z.string(),
  username: z.string().optional(),
  name: z.string().optional(),
  picture: z.string().url().optional(),
  role: UserRoleEnum,
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  is_profile_complete: z.boolean(),
  created_at: z.string(),
  creator_bio: z.string().optional(),
  creator_category: z.string().optional(),
  creator_experience_years: z.number().optional(),
  creator_portfolio_url: z.string().url().optional(),
  creator_approved_at: z.string().optional(),
  settings_metadata: z.any().optional(),
});

export const userSessionSchema = z.object({
  session_id: z.string(),
  device_info: z.string().optional(),
  ip_address: z.string().optional(),
  is_active: z.boolean(),
  created_at: z.string(),
  last_active: z.string(),
  is_current: z.boolean(),
  risk_score: z.number(),
});

export const authTokensSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
});

export const loginResponseDataSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  user: userSchema,
  requires_2fa: z.boolean().optional(),
});

export const signupResponseDataSchema = z.object({
  email: z.string().email(),
  expires_in_minutes: z.number(),
});

export const googleAuthUrlDataSchema = z.object({
  auth_url: z.string().url(),
});

export const sessionsResponseDataSchema = z.object({
  sessions: z.array(userSessionSchema),
  total_sessions: z.number(),
  max_sessions: z.number(),
});

export const profileCompletionSchema = z.object({
  is_complete: z.boolean(),
  completion_percentage: z.number(),
  missing_fields: z.array(z.string()),
  required_fields: z.array(z.string()),
  optional_fields: z.array(z.string()),
});

export const apiErrorSchema = z.object({
  detail: z.string(),
  status_code: z.number().optional(),
});

export const enable2FAResponseSchema = z.object({
  two_fa_enabled: z.boolean(),
});

export const disable2FAResponseSchema = z.object({
  two_fa_enabled: z.boolean(),
});

export const changePasswordResponseSchema = z.object({
  changed_at: z.string(),
});

export const userSetupResponseSchema = z.object({
  is_profile_complete: z.boolean(),
  updated_fields: z.array(z.string()),
});

export const updateProfileResponseSchema = z.object({
  is_profile_complete: z.boolean(),
  updated_fields: z.array(z.string()),
});

export const apiResponseSchema = <T extends z.ZodTypeAny>(inner?: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: (inner ?? z.any()).optional(),
    timestamp: z.string().optional(),
  });

export type User = z.infer<typeof userSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type PublicUserProfile = z.infer<typeof publicUserProfileSchema>;
export type UserSession = z.infer<typeof userSessionSchema>;
export type AuthTokens = z.infer<typeof authTokensSchema>;
export type LoginResponseData = z.infer<typeof loginResponseDataSchema>;
export type SignupResponseData = z.infer<typeof signupResponseDataSchema>;
export type GoogleAuthUrlData = z.infer<typeof googleAuthUrlDataSchema>;
export type SessionsResponseData = z.infer<typeof sessionsResponseDataSchema>;
export type ProfileCompletion = z.infer<typeof profileCompletionSchema>;
export type APIError = z.infer<typeof apiErrorSchema>;
export type Enable2FAResponse = z.infer<typeof enable2FAResponseSchema>;
export type Disable2FAResponse = z.infer<typeof disable2FAResponseSchema>;
export type ChangePasswordResponse = z.infer<typeof changePasswordResponseSchema>;
export type UserSetupResponse = z.infer<typeof userSetupResponseSchema>;
export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;
