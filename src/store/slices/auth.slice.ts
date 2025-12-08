import { create } from "zustand";
import type {
  User,
  UserProfile,
  AuthTokens,
  LoginRequest,
  SignupRequest,
  VerifyOTPRequest,
  Verify2FARequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  Enable2FARequest,
  Disable2FARequest,
  APIResponse,
  LoginResponseData,
  SignupResponseData,
  UserSetupRequest,
  UserSetupResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  Enable2FAResponse,
  Disable2FAResponse,
  PreRegisterResponse,
} from "../../types/auth.types";
import { authService } from "../../services/auth.service";

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean;
  isLoading: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  clearError: () => void;

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
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  tokens: null,
  isAuthenticated: false,
  isInitialLoading: true,
  isLoading: false,
  error: null,

  async initialize() {
    try {
      set({ isInitialLoading: true, error: null });
      const storedTokens = authService.getStoredTokens();

      if (!storedTokens.accessToken || !storedTokens.refreshToken) {
        set({ isInitialLoading: false, isAuthenticated: false });
        return;
      }

      const tokens: AuthTokens = {
        access_token: storedTokens.accessToken,
        refresh_token: storedTokens.refreshToken,
        token_type: "bearer",
        expires_in: 0,
      };

      set({ tokens, isAuthenticated: true });

      const profileResponse = await authService.getCurrentUser();
      if (profileResponse.success && profileResponse.data?.profile) {
        const profile = profileResponse.data.profile;
        const user: User = {
          email: profile.email || "",
          user_id: profile.user_id || "",
          role: profile.role,
          two_fa_enabled: profile.two_fa_enabled || false,
        };
        set({ profile, user, isAuthenticated: true });
      }
    } catch (error) {
      authService.clearTokens();
      set({ user: null, profile: null, tokens: null, isAuthenticated: false });
    } finally {
      set({ isInitialLoading: false });
    }
  },

  clearError() {
    set({ error: null });
  },

  async preRegister(data) {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.preregister(data);
      if (!response.success) {
        set({ error: response.message || "Pre-register check failed" });
      }
      return response;
    } finally {
      set({ isLoading: false });
    }
  },

  async login(credentials) {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        const data = response.data;
        if (data.requires_2fa) {
          return response;
        }
        const tokens: AuthTokens = {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          token_type: data.token_type,
          expires_in: data.expires_in,
        };
        authService.storeTokens(tokens.access_token, tokens.refresh_token);
        set({ tokens, user: data.user, isAuthenticated: true });
      } else {
        set({ error: response.message || "Login failed" });
      }
      return response;
    } finally {
      set({ isLoading: false });
    }
  },

  async signup(data) {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.signup(data);
      if (!response.success) {
        set({ error: response.message || "Signup failed" });
      }
      return response;
    } finally {
      set({ isLoading: false });
    }
  },

  async verifyOTP(data) {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.verifyOTP(data);
      if (response.success && response.data) {
        const d = response.data;
        const tokens: AuthTokens = {
          access_token: d.access_token,
          refresh_token: d.refresh_token,
          token_type: d.token_type,
          expires_in: d.expires_in,
        };
        authService.storeTokens(tokens.access_token, tokens.refresh_token);
        set({ tokens, user: d.user, isAuthenticated: true });
      } else {
        set({ error: response.message || "OTP verification failed" });
      }
      return response;
    } finally {
      set({ isLoading: false });
    }
  },

  async verify2FA(data) {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.verify2FA(data);
      if (response.success && response.data) {
        const d = response.data;
        const tokens: AuthTokens = {
          access_token: d.access_token,
          refresh_token: d.refresh_token,
          token_type: d.token_type,
          expires_in: d.expires_in,
        };
        authService.storeTokens(tokens.access_token, tokens.refresh_token);
        set({ tokens, user: d.user, isAuthenticated: true });
      } else {
        set({ error: response.message || "2FA verification failed" });
      }
      return response;
    } finally {
      set({ isLoading: false });
    }
  },

  async logout() {
    try {
      set({ isLoading: true, error: null });
      await authService.logout();
    } finally {
      authService.clearTokens();
      set({ user: null, profile: null, tokens: null, isAuthenticated: false });
      set({ isLoading: false });
    }
  },

  async forgotPassword(data) {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.forgotPassword(data);
      if (!response.success) {
        set({ error: response.message || "Password reset request failed" });
      }
      return response;
    } finally {
      set({ isLoading: false });
    }
  },

  async resetPassword(data) {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.resetPassword(data);
      if (!response.success) {
        set({ error: response.message || "Password reset failed" });
      }
      return response;
    } finally {
      set({ isLoading: false });
    }
  },

  async enable2FA(data) {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.enable2FA(data);
      if (response.success) {
        const user = get().user;
        if (user) {
          set({ user: { ...user, two_fa_enabled: true } });
        }
      } else {
        set({ error: response.message || "Failed to enable 2FA" });
      }
      return response;
    } finally {
      set({ isLoading: false });
    }
  },

  async disable2FA(data) {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.disable2FA(data);
      if (response.success) {
        const user = get().user;
        if (user) {
          set({ user: { ...user, two_fa_enabled: false } });
        }
      } else {
        set({ error: response.message || "Failed to disable 2FA" });
      }
      return response;
    } finally {
      set({ isLoading: false });
    }
  },

  async UserSetup(data) {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.userSetup(data);
      if (response.success) {
        const profileResponse = await authService.getCurrentUser();
        if (profileResponse.success && profileResponse.data?.profile) {
          set({ profile: profileResponse.data.profile });
        }
      } else {
        set({ error: response.message || "User setup failed" });
      }
      return response;
    } finally {
      set({ isLoading: false });
    }
  },

  async getProfile() {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.getCurrentUser();
      if (response.success && response.data?.profile) {
        set({ profile: response.data.profile });
      } else {
        set({ error: response.message || "Failed to get profile" });
      }
      return response;
    } finally {
      set({ isLoading: false });
    }
  },

  async updateProfile(data) {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.updateProfile(data);
      if (response.success) {
        const profileResponse = await authService.getCurrentUser();
        if (profileResponse.success && profileResponse.data?.profile) {
          set({ profile: profileResponse.data.profile });
        }
      } else {
        set({ error: response.message || "Profile update failed" });
      }
      return response;
    } finally {
      set({ isLoading: false });
    }
  },
}));
