"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";
import type {
  AuthContextType,
  AuthTokens,
  APIResponse,
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const refreshPromiseRef = useRef<Promise<boolean> | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isAuthenticated = !!user && !!tokens;

  useEffect(() => {
    initializeAuth();

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (tokens?.access_token && tokens?.expires_in) {
      scheduleTokenRefresh(tokens.expires_in);
    }

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [tokens]);

  const scheduleTokenRefresh = (expiresIn: number) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    const fiveMinutes = 5 * 60 * 1000;
    const eightyPercent = expiresIn * 0.8 * 1000;
    const refreshIn = Math.min(expiresIn * 1000 - fiveMinutes, eightyPercent);

    if (refreshIn > 0) {
      refreshTimerRef.current = setTimeout(() => {
        refreshTokenSilently();
      }, refreshIn);
    }
  };

  const initializeAuth = async () => {
    try {
      setError(null);
      const storedTokens = authService.getStoredTokens();

      if (!storedTokens.accessToken || !storedTokens.refreshToken) {
        setIsInitialLoading(false);
        return;
      }

      setTokens({
        access_token: storedTokens.accessToken,
        refresh_token: storedTokens.refreshToken,
        token_type: "bearer",
        expires_in: 0,
      });

      if (authService.isTokenExpired(storedTokens.accessToken)) {
        const refreshSuccess = await refreshTokenSilently();
        if (!refreshSuccess) {
          authService.clearTokens();
          setTokens(null);
          setIsInitialLoading(false);
          return;
        }
      }

      const profileSuccess = await fetchUserProfile();

      if (!profileSuccess) {
        authService.clearTokens();
        setTokens(null);
        setUser(null);
        setProfile(null);
      }
    } catch {
      authService.clearTokens();
      setTokens(null);
      setUser(null);
      setProfile(null);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const refreshTokenSilently = async (): Promise<boolean> => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const refreshPromise = (async () => {
      try {
        const storedTokens = authService.getStoredTokens();
        if (!storedTokens.refreshToken) {
          return false;
        }

        const response = await authService.refreshToken(storedTokens.refreshToken);

        if (response.success && response.data) {
          const newTokens: AuthTokens = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            token_type: "bearer",
            expires_in: response.data.expires_in,
          };

          authService.storeTokens(newTokens.access_token, newTokens.refresh_token);
          setTokens(newTokens);

          return true;
        }

        return false;
      } catch {
        return false;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = refreshPromise;
    return refreshPromise;
  };

  const fetchUserProfile = async (retryCount = 0): Promise<boolean> => {
    try {
      const response = await authService.getCurrentUser();

      if (response.success && response.data?.profile) {
        const profileData = response.data.profile;
        setProfile(profileData);
        setUser({
          email: profileData.email || "",
          user_id: profileData.user_id || "",
          role: profileData.role,
          two_fa_enabled: profileData.two_fa_enabled || false,
        });
        return true;
      }

      return false;
    } catch (error: any) {
      if (error?.status === 401 && retryCount === 0) {
        const refreshSuccess = await refreshTokenSilently();
        if (refreshSuccess) {
          return fetchUserProfile(retryCount + 1);
        }
      }

      return false;
    }
  };

  const withTokenRefresh = async <T,>(
    apiCall: () => Promise<APIResponse<T>>,
    retryCount = 0,
  ): Promise<APIResponse<T>> => {
    try {
      return await apiCall();
    } catch (error: any) {
      if (error?.status === 401 && retryCount === 0) {
        const refreshSuccess = await refreshTokenSilently();
        if (refreshSuccess) {
          return withTokenRefresh(apiCall, retryCount + 1);
        }
        await logout();
      }

      throw error;
    }
  };

  const getProfile = async (): Promise<APIResponse<{ profile: UserProfile }>> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await withTokenRefresh(() => authService.getCurrentUser());

      if (response.success && response.data?.profile) {
        const profileData = response.data.profile;
        setProfile(profileData);
        return response;
      }

      const message = response.message || "Failed to get current user";
      setError(message);
      throw new Error(message);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get current user";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest): Promise<APIResponse<LoginResponseData>> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(credentials);

      if (response.success && response.data) {
        const data = response.data;

        if (data.requires_2fa) {
          return response;
        }

        const newTokens: AuthTokens = {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          token_type: data.token_type,
          expires_in: data.expires_in,
        };

        authService.storeTokens(newTokens.access_token, newTokens.refresh_token);
        setTokens(newTokens);
        setUser(data.user);

        await fetchUserProfile();

        // Redirect to dashboard/home after successful login
        router.push("/dashboard/home");

        return response;
      }

      const message = response.message || "Login failed";
      setError(message);
      throw new Error(message);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const preRegister = async (data: { email: string }): Promise<APIResponse<PreRegisterResponse>> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.preregister(data);
      if (response.success) {
        return response;
      }

      const message = response.message || "Pre-register check failed";
      setError(message);
      throw new Error(message);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Pre-register check failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupRequest): Promise<APIResponse<SignupResponseData>> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.signup(data);
      if (response.success) {
        return response;
      }

      const message = response.message || "Signup failed";
      setError(message);
      throw new Error(message);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (data: VerifyOTPRequest): Promise<APIResponse<LoginResponseData>> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.verifyOTP(data);

      if (response.success && response.data) {
        const d = response.data;
        const newTokens: AuthTokens = {
          access_token: d.access_token,
          refresh_token: d.refresh_token,
          token_type: d.token_type,
          expires_in: d.expires_in,
        };

        authService.storeTokens(newTokens.access_token, newTokens.refresh_token);
        setTokens(newTokens);
        setUser(d.user);

        await fetchUserProfile();

        // Redirect to dashboard/home after successful OTP verification
        router.push("/dashboard/home");

        return response;
      }

      const message = response.message || "OTP verification failed";
      setError(message);
      throw new Error(message);
    } catch (err) {
      const message = err instanceof Error ? err.message : "OTP verification failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const UserSetup = async (
    data: UserSetupRequest,
  ): Promise<APIResponse<UserSetupResponse>> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await withTokenRefresh(() => authService.userSetup(data));

      if (response.success) {
        await fetchUserProfile();
        
        // Redirect to dashboard/home after successful user setup
        router.push("/dashboard/home");
        
        return response;
      }

      const message = response.message || "User setup failed";
      setError(message);
      throw new Error(message);
    } catch (err) {
      const message = err instanceof Error ? err.message : "User setup failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (
    data: Partial<UpdateProfileRequest>,
  ): Promise<APIResponse<UpdateProfileResponse>> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await withTokenRefresh(() => authService.updateProfile(data));

      if (response.success) {
        await fetchUserProfile();
        return response;
      }

      const message = response.message || "Profile update failed";
      setError(message);
      throw new Error(message);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Profile update failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verify2FA = async (data: Verify2FARequest): Promise<APIResponse<LoginResponseData>> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.verify2FA(data);

      if (response.success && response.data) {
        const d = response.data;
        const newTokens: AuthTokens = {
          access_token: d.access_token,
          refresh_token: d.refresh_token,
          token_type: d.token_type,
          expires_in: d.expires_in,
        };

        authService.storeTokens(newTokens.access_token, newTokens.refresh_token);
        setTokens(newTokens);
        setUser(d.user);

        await fetchUserProfile();

        // Redirect to dashboard/home after successful 2FA verification
        router.push("/dashboard/home");

        return response;
      }

      const message = response.message || "2FA verification failed";
      setError(message);
      throw new Error(message);
    } catch (err) {
      const message = err instanceof Error ? err.message : "2FA verification failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      await authService.logout();
    } catch {
    } finally {
      authService.clearTokens();
      setUser(null);
      setProfile(null);
      setTokens(null);
      setError(null);
      setIsLoading(false);
      router.push("/login");
    }
  };

  const forgotPassword = async (data: ForgotPasswordRequest): Promise<APIResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.forgotPassword(data);
      if (response.success) {
        return response;
      }

      const message = response.message || "Password reset request failed";
      setError(message);
      throw new Error(message);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Password reset request failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordRequest): Promise<APIResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.resetPassword(data);
      if (response.success) {
        return response;
      }

      const message = response.message || "Password reset failed";
      setError(message);
      throw new Error(message);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Password reset failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const enable2FA = async (data: Enable2FARequest): Promise<APIResponse<Enable2FAResponse>> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await withTokenRefresh(() => authService.enable2FA(data));

      if (response.success && user) {
        setUser({ ...user, two_fa_enabled: true });
        return response;
      }

      const message = response.message || "Failed to enable 2FA";
      setError(message);
      throw new Error(message);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to enable 2FA";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const disable2FA = async (
    data: Disable2FARequest,
  ): Promise<APIResponse<Disable2FAResponse>> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await withTokenRefresh(() => authService.disable2FA(data));

      if (response.success && user) {
        setUser({ ...user, two_fa_enabled: false });
        return response;
      }

      const message = response.message || "Failed to disable 2FA";
      setError(message);
      throw new Error(message);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to disable 2FA";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const refreshUser = async () => {
    try {
      await fetchUserProfile();
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to refresh user";
      setError(message);
    }
  };

  const value: AuthContextType = {
    user,
    tokens,
    isAuthenticated,
    isInitialLoading,
    isLoading,
    error,
    profile,
    preRegister,
    login,
    signup,
    verifyOTP,
    verify2FA,
    logout,
    forgotPassword,
    resetPassword,
    enable2FA,
    disable2FA,
    UserSetup,
    getProfile,
    updateProfile,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
