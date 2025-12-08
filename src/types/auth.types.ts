import { DeviceData, LocationData } from "./genai.types";

export enum AuthProvider {
  EMAIL = "email",
  GOOGLE = "google",
}

export enum UserRole {
  ADMIN = "admin",
  PROFESSIONAL = "professional",
  STUDENT = "student",
  USER = "user",
}

export enum ApplicationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  FLAGGED = "flagged",
}

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp?: string;
}

export interface SignupRequestBody {
  email: string;
}

export interface SignupRequest {
  request: SignupRequestBody;
  device_data?: DeviceData;
}

export interface PreRegisterResponse {
  exists: boolean;
  prereg_data: {
    id: number;
    name: string;
    email: string;
  };
}

export interface MouseMovementData {
  additionalProp1: {
    x: number;
    y: number;
    timestamp: number;
  };
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
  password: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginRequest {
  request: LoginRequestBody;
  device_data?: DeviceData;
  location_data?: LocationData;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  changed_at: string;
}

export interface AccountDeleteRequest {
  password: string;
  confirm_password: string;
  confirmation: string;
}

export interface Enable2FARequest {
  password: string;
}

export interface Enable2FAResponse {
  two_fa_enabled: boolean;
}

export interface Verify2FARequest {
  email: string;
  otp: string;
}

export interface Disable2FARequest {
  password: string;
}

export interface Disable2FAResponse {
  two_fa_enabled: boolean;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface UserSetupRequest {
  username?: string;
  name?: string;
  picture?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  date_of_birth?: string;
  interests?: string[];
  role?: string;
}

export interface UserSetupResponse {
  is_profile_complete: boolean;
  updated_fields: string[];
}

export interface ProfileUpdateRequest {
  username?: string;
  name?: string;
  picture?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  date_of_birth?: string;
  interests?: string[];
}

export interface UsernameUpdateRequest {
  username: string;
}

export interface User {
  user_id: string;
  email: string;
  name?: string;
  username?: string;
  picture?: string;
  provider?: AuthProvider;
  role: UserRole;
  is_verified?: boolean;
  two_fa_enabled?: boolean;
  is_profile_complete?: boolean;
  created_at?: string;
  last_login?: string;
}

interface ProfileData {
  profile: UserProfile;
}

export interface UserProfile {
  education?: string | null;
  year_of_passing?: string | null;
  user_id?: string;
  username?: string | null;
  name?: string | null;
  email?: string;
  picture?: string | null;
  cover_image?: string | null;
  provider?: AuthProvider;
  role: UserRole;
  status?: string;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  interests?: string[];
  is_profile_complete?: boolean;
  is_profile_public?: boolean;
  profile_score?: number;
  risk_score?: number;
  spam_score?: number;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  profession?: string | null;
  two_fa_enabled?: boolean;
  isverified_creator?: boolean;
  settings_metadata?: any;
  creator_bio?: string;
  creator_category?: string;
  creator_experience_years?: number;
  creator_portfolio_url?: string;
  creator_approved_at?: string;
}

export interface PublicUserProfile {
  user_id: string;
  username?: string;
  name?: string;
  picture?: string;
  role: UserRole;
  bio?: string;
  location?: string;
  website?: string;
  is_profile_complete: boolean;
  created_at: string;
  creator_bio?: string;
  creator_category?: string;
  creator_experience_years?: number;
  creator_portfolio_url?: string;
  creator_approved_at?: string;
}

export interface UpdateProfileRequest {
  name: string;
  username: string;
  phone: string;
  bio: string;
  interests: string[];
  education: string;
  year_of_passing: string;
  profession: string;
}

export interface UpdateProfileResponse {
  is_profile_complete: boolean;
  updated_fields: string[];
}

export interface ReviewApplicationRequest {
  status: ApplicationStatus;
  review_notes?: string;
}

export interface UserSession {
  session_id: string;
  device_info?: string;
  ip_address?: string;
  is_active: boolean;
  created_at: string;
  last_active: string;
  is_current: boolean;
  risk_score: number;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginResponseData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
  requires_2fa?: boolean;
}

export interface SignupResponseData {
  email: string;
  expires_in_minutes: number;
}

export interface GoogleAuthUrlData {
  auth_url: string;
}

export interface SessionsResponseData {
  sessions: UserSession[];
  total_sessions: number;
  max_sessions: number;
}

export interface ProfileCompletion {
  is_complete: boolean;
  completion_percentage: number;
  missing_fields: string[];
  required_fields: string[];
  optional_fields: string[];
}

export interface APIError {
  detail: string;
  status_code?: number;
}

export interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean;
  isLoading: boolean;
  error: string | null;
  profile: UserProfile | null;
  preRegister: (data: { email: string }) => Promise<APIResponse<PreRegisterResponse>>;
  login: (credentials: LoginRequest) => Promise<APIResponse<LoginResponseData>>;
  signup: (data: SignupRequest) => Promise<APIResponse<SignupResponseData>>;
  verifyOTP: (data: VerifyOTPRequest) => Promise<APIResponse<LoginResponseData>>;
  verify2FA: (data: Verify2FARequest) => Promise<APIResponse<LoginResponseData>>;
  logout: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<APIResponse>;
  resetPassword: (data: ResetPasswordRequest) => Promise<APIResponse>;
  enable2FA: (data: Enable2FARequest) => Promise<APIResponse<Enable2FAResponse>>;
  disable2FA: (data: Disable2FARequest) => Promise<APIResponse<Disable2FAResponse>>;
  UserSetup: (data: UserSetupRequest) => Promise<APIResponse<UserSetupResponse>>;
  getProfile: () => Promise<APIResponse<{ profile: UserProfile }>>;
  updateProfile: (data: Partial<UpdateProfileRequest>) => Promise<APIResponse<UpdateProfileResponse>>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}
