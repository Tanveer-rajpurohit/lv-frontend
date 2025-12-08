import { z } from "zod";

// Common point schema for mouse movement
export const MousePointSchema = z.object({
  x: z.number(),
  y: z.number(),
  timestamp: z.number(),
});

export const DeviceDataSchema = z.object({
  user_agent: z.string(),
  screen_resolution: z.string(),
  timezone: z.string(),
  language: z.string().optional(),
  platform: z.string().optional(),
  cookie_enabled: z.boolean().optional(),
  mouse_movements: z.array(MousePointSchema).optional(),
  form_completion_time: z.number().optional(),
});

export const LocationDataSchema = z.object({
  country: z.string(),
  city: z.string(),
  region: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const RiskEvaluateRequestSchema = z.object({
  mouse_movements: z.array(MousePointSchema),
  completion_time_seconds: z.number(),
  email: z.string().email(),
  device_info: DeviceDataSchema,
  event_type: z.enum(["registration", "login"]),
});
export type RiskEvaluateRequest = z.infer<typeof RiskEvaluateRequestSchema>;

export const ProfileDataForScoreSchema = z.object({
  name: z.string().min(1),
  profession: z.string().min(1),
  education: z.string().min(1),
  experience_years: z.number().int().nonnegative(),
});
export type ProfileDataForScore = z.infer<typeof ProfileDataForScoreSchema>;
