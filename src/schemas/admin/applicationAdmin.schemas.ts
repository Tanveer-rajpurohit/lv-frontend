import { z } from "zod";

// Local enum for application admin status (no 'flagged' here per types)
export const AdminCreatorApplicationStatusEnum = z.enum(["pending", "approved", "rejected"]);

export const spamAnalysisSchema = z.object({
  spam_score: z.number(),
  spam_level: z.string(),
  confidence: z.number(),
});

export const creatorApplicationAdminSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  bio: z.string(),
  category: z.string(),
  experience_years: z.number(),
  portfolio_url: z.string().url().optional(),
  why_creator: z.string(),
  status: AdminCreatorApplicationStatusEnum,
  applied_at: z.string(),
  reviewed_at: z.string().optional(),
  reviewed_by: z.string().optional(),
  review_notes: z.string().optional(),
  user_name: z.string().optional(),
  user_email: z.string().email().optional(),
  user_username: z.string().optional(),
  spam_analysis: spamAnalysisSchema.optional(),
  flags: z.object({
    high_spam_risk: z.boolean(),
    high_user_risk: z.boolean(),
    needs_review: z.boolean(),
    urgent: z.boolean(),
  }),
});

export const creatorApplicationsResponseDataAdminSchema = z.object({
  applications: z.array(creatorApplicationAdminSchema),
  pagination: z.object({
    current_page: z.number(),
    limit: z.number(),
    pages: z.number(),
    skip: z.number(),
    total: z.number(),
  }),
  filter_status: AdminCreatorApplicationStatusEnum.optional(),
});

export type CreatorApplicationAdmin = z.infer<typeof creatorApplicationAdminSchema>;
export type CreatorApplicationsResponseDataAdmin = z.infer<typeof creatorApplicationsResponseDataAdminSchema>;
