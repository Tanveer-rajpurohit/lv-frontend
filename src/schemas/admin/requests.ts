import { z } from "zod";
import { UserRoleEnum, ApplicationStatusEnum } from "@/schemas/common/enums";

//admin: user action

export const UserActionRequestSchema = z.object({
    user_id: z.string().min(1),
    action: z.enum(["suspend", "ban", "delete", "restore"]),
    reason: z.string().min(1),
    duration_hours: z.number().int().nonnegative(),
});
export type UserActionRequest = z.infer<typeof UserActionRequestSchema>;

// Admin: suspend user
export const SuspendUserRequestSchema = z.object({
    user_id: z.string().min(1),
    reason: z.string().min(1),
    duration_days: z.number().int().nonnegative(),
    notify_user: z.boolean(),
});
export type SuspendUserRequest = z.infer<typeof SuspendUserRequestSchema>;

// Admin: restore user
export const RestoreUserRequestSchema = z.object({
    user_id: z.string().min(1),
    reason: z.string().min(1),
    notify_user: z.boolean(),
});
export type RestoreUserRequest = z.infer<typeof RestoreUserRequestSchema>;

// Admin: review application
export const AdminReviewApplicationRequestSchema = z.object({
    status: z.enum(["approved", "rejected"]),
    review_notes: z.string().optional(),
});
export type AdminReviewApplicationRequest = z.infer<typeof AdminReviewApplicationRequestSchema>;

// Admin: update user score
export const UpdateUserScoreSchema = z.object({
    user_id: z.string().min(1),
    risk_score: z.number(),
    spam_score: z.number(),
    profile_score: z.number(),
    reason: z.string().min(1),
});
export type UpdateUserScore = z.infer<typeof UpdateUserScoreSchema>;

// Admin: update user role
export const UpdateUserRoleSchema = z.object({
    user_id: z.string().min(1),
    new_role: UserRoleEnum,
    reason: z.string().min(1),
});
export type UpdateUserRole = z.infer<typeof UpdateUserRoleSchema>;
