import { z } from "zod";
import { ApplicationStatusEnum } from "@/schemas/common/enums";

// Creator application requests (user side)
export const CreatorApplicationRequestSchema = z.object({
  education: z.string().min(1),
  practise_area: z.string().min(1),
  year_of_passing: z.number().int(),
});
export type CreatorApplicationRequest = z.infer<typeof CreatorApplicationRequestSchema>;

// Admin-side review for creator applications can reuse AdminReviewApplicationRequestSchema
// from '@/schemas/admin/requests' if needed.

// For filtering/listing creator applications (query-like payloads)
export const ListCreatorApplicationsQuerySchema = z.object({
  status: ApplicationStatusEnum.optional(),
  skip: z.number().int().nonnegative().optional(),
  limit: z.number().int().positive().optional(),
});
export type ListCreatorApplicationsQuery = z.infer<typeof ListCreatorApplicationsQuerySchema>;
