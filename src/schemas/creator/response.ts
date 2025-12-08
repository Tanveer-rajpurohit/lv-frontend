import { z } from "zod";
import { ApplicationStatusEnum } from "../auth/response";

export const creatorApplicationSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  bio: z.string(),
  category: z.string(),
  experience_years: z.number(),
  portfolio_url: z.string().url().optional(),
  why_creator: z.string(),
  status: ApplicationStatusEnum,
  applied_at: z.string(),
  reviewed_at: z.string().optional(),
  reviewed_by: z.string().optional(),
  review_notes: z.string().optional(),
  user_name: z.string().optional(),
  user_email: z.string().email().optional(),
  user_username: z.string().optional(),
});

export const creatorApplicationsDataSchema = z.object({
  applications: z.array(creatorApplicationSchema),
  total: z.number(),
});

export const creatorApplicationResponseSchema = z.object({
  application_id: z.string(),
  status: z.string(),
  applied_at: z.string(),
});

export const applyForCreatorEligibilitySchema = z.object({
  eligible: z.boolean(),
  message: z.string(),
  profile_complete: z.boolean(),
  current_role: z.string(),
});

export type CreatorApplication = z.infer<typeof creatorApplicationSchema>;
export type CreatorApplicationsData = z.infer<typeof creatorApplicationsDataSchema>;
export type CreatorApplicationResponse = z.infer<typeof creatorApplicationResponseSchema>;
export type ApplyForCreatorEligiblity = z.infer<typeof applyForCreatorEligibilitySchema>;
