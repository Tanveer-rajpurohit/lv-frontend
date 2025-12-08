import { z } from "zod";

export const UserRoleEnum = z.enum(["user", "creator", "admin"]);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const ApplicationStatusEnum = z.enum(["pending", "approved", "rejected", "flagged"]);
export type ApplicationStatus = z.infer<typeof ApplicationStatusEnum>;
