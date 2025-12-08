import type {
  APIResponse,
  AuthTokens,
  Disable2FARequest,
  Disable2FAResponse,
  Enable2FARequest,
  Enable2FAResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponseData,
  PreRegisterResponse,
  ResetPasswordRequest,
  SignupRequest,
  SignupResponseData,
  User,
  UserProfile,
  UserSetupRequest,
  UserSetupResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  Verify2FARequest,
  VerifyOTPRequest,
} from "../types/auth.types";

const API_BASE_URL = ""; // Use relative URLs for Next.js proxy

const API_ENDPOINTS = {
  PREREGISTER: "api/auth/check-preregister",
  SIGNUP: "api/auth/signup",
  LOGIN: "api/auth/login",
  LOGOUT: "api/auth/logout",
  VERIFY_OTP: "api/auth/verify-otp",
  FORGOT_PASSWORD: "api/auth/forgot-password",
  RESET_PASSWORD: "api/auth/reset-password",
  REFRESH_TOKEN: "api/auth/refresh",
  VERIFY_2FA: "api/auth/verify-2fa",
  ME: "api/users/profile",
} as const;

async function request<T>(
  path: string,
  init: RequestInit,
): Promise<APIResponse<T>> {
  const url = `${API_BASE_URL}/${path}`.replace(/\/+/g, "/");
  console.log('Final API URL:', url); // Debug log

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  });

  const data = (await res.json().catch(() => ({}))) as APIResponse<T>;

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || res.statusText || "Request failed",
      data: data.data,
      timestamp: data.timestamp,
    };
  }

  return data;
}

export class AuthService {
  private readonly accessTokenKey = 'access_token';
  private readonly refreshTokenKey = 'refresh_token';

  private getAuthHeaders(): Record<string, string> {
    const tokens = this.getStoredTokens();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (tokens.accessToken) {
      headers['Authorization'] = `Bearer ${tokens.accessToken}`;
    }
    
    return headers;
  }

  private async requestWithAuth<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<APIResponse<T>> {
    const url = `${API_BASE_URL}/${path}`.replace(/\/+/g, "/").replace(/^http:\/\//, "http://");
    console.log('Auth API URL:', url); // Debug log

    const res = await fetch(url, {
      headers: {
        ...this.getAuthHeaders(),
        ...(init.headers ?? {}),
      },
      ...init,
    });

    const data = (await res.json().catch(() => ({}))) as APIResponse<T>;

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || res.statusText || "Request failed",
        data: data.data,
        timestamp: data.timestamp,
      };
    }

    return data;
  }

  async preregister(data: { email: string }): Promise<APIResponse<PreRegisterResponse>> {
    return request<PreRegisterResponse>(API_ENDPOINTS.PREREGISTER, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(payload: LoginRequest): Promise<APIResponse<LoginResponseData>> {
    return request<LoginResponseData>(API_ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async signup(payload: SignupRequest): Promise<APIResponse<SignupResponseData>> {
    return request<SignupResponseData>(API_ENDPOINTS.SIGNUP, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async verifyOTP(payload: VerifyOTPRequest): Promise<APIResponse<LoginResponseData>> {
    return request<LoginResponseData>(API_ENDPOINTS.VERIFY_OTP, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async verify2FA(payload: Verify2FARequest): Promise<APIResponse<LoginResponseData>> {
    return request<LoginResponseData>(API_ENDPOINTS.VERIFY_2FA, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async forgotPassword(payload: ForgotPasswordRequest): Promise<APIResponse> {
    return request(API_ENDPOINTS.FORGOT_PASSWORD, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async resetPassword(payload: ResetPasswordRequest): Promise<APIResponse> {
    return request(API_ENDPOINTS.RESET_PASSWORD, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async refreshToken(refreshToken: string): Promise<APIResponse<AuthTokens>> {
    return request<AuthTokens>(API_ENDPOINTS.REFRESH_TOKEN, {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  async getCurrentUser(): Promise<APIResponse<{ profile: UserProfile }>> {
    return this.requestWithAuth<{ profile: UserProfile }>(API_ENDPOINTS.ME, {
      method: "GET",
    });
  }

  async logout(): Promise<APIResponse> {
    return this.requestWithAuth(API_ENDPOINTS.LOGOUT, {
      method: "POST",
    });
  }

  async userSetup(data: UserSetupRequest): Promise<APIResponse<UserSetupResponse>> {
    return this.requestWithAuth<UserSetupResponse>('api/users/setup', {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProfile(data: Partial<UpdateProfileRequest>): Promise<APIResponse<UpdateProfileResponse>> {
    return this.requestWithAuth<UpdateProfileResponse>('api/users/profile', {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async enable2FA(data: Enable2FARequest): Promise<APIResponse<Enable2FAResponse>> {
    return this.requestWithAuth<Enable2FAResponse>('api/users/enable-2fa', {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async disable2FA(data: Disable2FARequest): Promise<APIResponse<Disable2FAResponse>> {
    return this.requestWithAuth<Disable2FAResponse>('api/users/disable-2fa', {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  storeTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.accessTokenKey, accessToken);
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
    if (typeof window === 'undefined') {
      return { accessToken: null, refreshToken: null };
    }

    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    };
  }

  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.accessTokenKey);
      localStorage.removeItem(this.refreshTokenKey);
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
}

export const authService = new AuthService();
