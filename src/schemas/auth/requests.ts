import { z } from "zod";

export const DeviceAdditionalInfoSchema = z.object({
  additionalProp1: z.any(),
});

export const DeviceMovementDataSchema = z.object({
  additionalProp1: z.number(),
  additionalProp2: z.number(),
  additionalProp3: z.number(),
});

export const DeviceDataSchema = z.object({
  device_id: z.string(),
  device_type: z.string(),
  screen_resolution: z.string(),
  timezone: z.string(),
  user_agent: z.string(),
  language: z.string(),
  additional_info: DeviceAdditionalInfoSchema.optional(),
  mouse_movements: z.array(DeviceMovementDataSchema),
  form_completion_time: z.number().optional(),
});

export const MouseMovementPointSchema = z.object({
  x: z.number(),
  y: z.number(),
  timestamp: z.number(),
});

export const PreregisterRequestSchema = z.object({
  email: z.email(),
});

export const SignupRequestSchema = z.object({
  request: z.object({
    email: z.email(),
  }),
  device_data: DeviceDataSchema.optional(),
});

export const VerifyOTPRequestSchema = z.object({
  email: z.email().min(1, "Email is required"),
  otp: z.string().min(1, "OTP is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    ),
});

export const LoginRequestSchema = z.object({
  request: z.object({
    email: z.email().min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password is required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      ),
    remember_me: z.boolean().optional(),
  }),
  device_data: DeviceDataSchema.optional(),
});

export const ForgotPasswordRequestSchema = z.object({
  email: z.email().min(1, "Email is required"),
});

export const ResetPasswordRequestSchema = z.object({
  email: z.email().min(1, "Email is required"),
  otp: z.string().min(1, "OTP is required"),
  new_password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    ),
});

export const ChangePasswordRequestSchema = z.object({
  current_password: z
    .string()
    .min(1, "Current password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    ),
  new_password: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    ),
});

export const AccountDeleteRequestSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    ),
  confirm_password: z
    .string()
    .min(1, "Confirm password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    ),
  confirmation: z
    .string()
    .min(1, "Confirmation is required")
    .regex(/^delete my account$/, "Please Enter 'delete my account'"),
});

export const Enable2FARequestSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    ),
});

export const Verify2FARequestSchema = z.object({
  email: z.email().min(1, "Email is required"),
  otp: z.string().min(1, "OTP is required"),
});

export const Disable2FARequestSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    ),
});

export const RefreshTokenRequestSchema = z.object({
  refresh_token: z.string().min(1, "Refresh token is required"),
});

export const UserSetupRequestSchema = z.object({
  username: z.string().optional(),
  name: z.string().optional(),
  picture: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  interests: z.array(z.string()).optional(),
  role: z.string().optional(),
});

export const ProfileUpdateRequestSchema = z.object({
  username: z.string().optional(),
  name: z.string().optional(),
  picture: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

export const UsernameUpdateRequestSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

export const UpdateProfileRequestSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  interests: z.array(z.string()).optional(),
  education: z.string().optional(),
  year_of_passing: z.string().optional(),
  profession: z.string().optional(),
});
