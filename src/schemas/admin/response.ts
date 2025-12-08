import { z } from "zod";
import { UserRoleEnum } from "../auth/response";
import { creatorApplicationAdminSchema } from "./applicationAdmin.schemas";

// Enums scoped to admin types
export const AdminApplicationStatusEnum = z.enum(["pending", "approved", "rejected"]);

// Core admin user detail schemas
export const userDetailsSchema = z.object({
  user_id: z.string(),
  email: z.string().email(),
  name: z.string(),
  username: z.string(),
  role: UserRoleEnum,
  status: z.enum(["active", "suspended", "banned", "deleted"]),
  is_verified: z.boolean(),
  is_profile_complete: z.boolean(),
  risk_score: z.number(),
  spam_score: z.number(),
  created_at: z.string(),
  last_login: z.string(),
  login_attempts: z.number(),
});

export const recentActivitySchema = z.object({
  action: z.string(),
  description: z.string(),
  ip_address: z.string(),
  created_at: z.string(),
});

export const userSessionDetailsSchema = z.object({
  session_id: z.string(),
  user_id: z.string(),
  ip_address: z.string(),
  created_at: z.string(),
  last_active: z.string(),
  is_active: z.boolean(),
});

export const userDetailsForAdminSchema = z.object({
  user_id: z.string(),
  email: z.string().email(),
  name: z.string(),
  username: z.string(),
  picture: z.string(),
  provider: z.string(),
  role: UserRoleEnum,
  status: z.enum(["active", "suspended", "banned", "deleted"]),
  is_verified: z.boolean(),
  two_fa_enabled: z.boolean(),
  is_profile_complete: z.boolean(),
  risk_score: z.number(),
  spam_score: z.number(),
  login_attempts: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  last_login: z.string(),
});

// List responses
export const applicationsResponseSchema = z.object({
  applications: z.array(creatorApplicationAdminSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
  filter_status: z.string().optional(),
});

export const usersResponseSchema = z.object({
  users: z.array(userDetailsSchema),
  pagination: z.object({
    current_page: z.number(),
    total: z.number(),
    limit: z.number(),
    pages: z.number(),
    skip: z.number(),
  }),
});

export const getUserByIdResponseSchema = z.object({
  user: userDetailsForAdminSchema,
  sessions: z.array(userSessionDetailsSchema),
  recent_activity: z.array(recentActivitySchema),
  timestamp: z.string().optional(),
});

// Action responses
export const userActionResponseSchema = z.object({
  user_id: z.string(),
  action: z.string(),
  reason: z.string(),
  duration_hours: z.number(),
  actioned_at: z.string(),
  actioned_by: z.string(),
});

export const suspendUserResponseSchema = z.object({
  user_id: z.string(),
  status: z.literal("suspended"),
  reason: z.string(),
  suspended_until: z.string(),
  suspended_at: z.string(),
  suspended_by: z.string(),
});

export const restoreUserResponseSchema = z.object({
  user_id: z.string(),
  status: z.literal("active"),
  restored_at: z.string(),
  restored_by: z.string(),
  restoration_reason: z.string(),
});

// System, stats and dashboard
export const systemInfoSchema = z.object({
  database_type: z.string(),
  redis_enabled: z.boolean(),
  authentication_method: z.string(),
  rate_limiting_enabled: z.boolean(),
  "2fa_enabled": z.boolean(),
  risk_assessment_enabled: z.boolean(),
  spam_detection_enabled: z.boolean(),
});

export const userStatsSchema = z.object({
  total_users: z.number(),
  users_by_role: z.object({ user: z.number(), creator: z.number(), admin: z.number() }),
  users_by_status: z.object({
    active: z.number(),
    suspended: z.number(),
    banned: z.number(),
    deleted: z.number(),
  }),
  users_by_provider: z.object({ email: z.number(), google: z.number() }),
  new_users_period: z.number(),
  verified_users: z.number(),
  users_with_2fa: z.number(),
  completed_profiles: z.number(),
});

export const sessionStatsSchema = z.object({
  total_sessions: z.number(),
  active_sessions: z.number(),
  sessions_period: z.number(),
  avg_session_duration: z.string(),
});

export const tokenStatsSchema = z.object({
  total_refresh_tokens: z.number(),
  active_refresh_tokens: z.number(),
  revoked_tokens: z.number(),
});

export const otpStatsSchema = z.object({
  total_otps: z.number(),
  valid_otps: z.number(),
  expired_otps: z.number(),
  otp_requests_last_hour: z.number(),
});

export const applicationStatsSchema = z.object({
  total_applications: z.number(),
  pending_applications: z.number(),
  approved_applications: z.number(),
  rejected_applications: z.number(),
  flagged_applications: z.number(),
});

export const creatorStatsSchema = z.object({
  total_creators: z.number(),
  active_creators: z.number(),
  pending_applications: z.number(),
  approval_rate: z.number(),
});

export const subscriptionStatsSchema = z.object({
  total_subscriptions: z.number(),
  active_subscriptions: z.number(),
  churn_rate: z.number(),
});

export const notificationStatsSchema = z.object({
  total_notifications: z.number(),
  unread_notifications: z.number(),
  notifications_today: z.number(),
});

export const securityStatsSchema = z.object({
  login_attempts_24h: z.number(),
  failed_logins_24h: z.number(),
  blocked_ips_24h: z.number(),
});

export const systemHealthSchema = z.object({
  health: z.object({
    overall_status: z.string(),
    timestamp: z.string(),
    services: z.object({
      database: z.object({ status: z.string(), error: z.string() }),
      redis: z.object({ status: z.string(), error: z.string() }),
    }),
    metrics: z.object({
      total_users: z.number(),
      active_sessions: z.number(),
      pending_applications: z.number(),
      system_load: z.string(),
    }),
    alerts: z.array(z.string()),
  }),
});

// Admin Dashboard
export const adminInfoSchema = z.object({
  admin_id: z.string(),
  admin_name: z.string(),
  admin_email: z.string().email(),
  last_login: z.string(),
  dashboard_generated_at: z.string(),
});

export const userOverviewSchema = z.object({
  total_users: z.number(),
  active_users: z.number(),
  suspended_users: z.number(),
  banned_users: z.number(),
  new_users_today: z.number(),
  new_users_week: z.number(),
  growth_rate_week: z.number(),
});

export const securityOverviewSchema = z.object({
  high_risk_users: z.number(),
  medium_risk_users: z.number(),
  high_spam_users: z.number(),
  recent_rate_limits_1h: z.number(),
  blocked_ips_24h: z.number(),
  security_score: z.number(),
});

export const creatorOverviewSchema = z.object({
  total_creators: z.number(),
  active_creators: z.number(),
  pending_applications: z.number(),
  flagged_applications: z.number(),
  applications_today: z.number(),
  approval_rate: z.number(),
});

export const systemOverviewSchema = z.object({
  active_sessions: z.number(),
  sessions_today: z.number(),
  total_subscriptions: z.number(),
  subscriptions_today: z.number(),
  unread_notifications: z.number(),
  notifications_today: z.number(),
});

export const systemActivitySchema = z.object({
  error: z.string().optional(),
});

export const quickActionSchema = z.object({
  name: z.string(),
  endpoint: z.string(),
  count: z.number(),
  priority: z.enum(["low", "medium", "high"]),
});

export const recentActivitiesSchema = z.object({
  flagged_applications: z.array(z.any()),
  high_risk_users: z.array(z.any()),
});

export const adminDashboardSchema = z.object({
  admin_info: adminInfoSchema,
  user_overview: userOverviewSchema,
  security_overview: securityOverviewSchema,
  creator_overview: creatorOverviewSchema,
  system_overview: systemOverviewSchema,
  system_activity: systemActivitySchema,
  priority_alerts: z.array(z.any()),
  recent_activities: recentActivitiesSchema,
  quick_actions: z.array(quickActionSchema),
});

// Audit logs
export const auditLogSchema = z.object({
  id: z.string(),
  user_id: z.string().nullable(),
  admin_id: z.string().nullable().optional(),
  action: z.string(),
  description: z.string(),
  ip_address: z.string(),
  user_agent: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  created_at: z.string(),
  user_email: z.string().nullable(),
  admin_email: z.string().nullable().optional(),
});

export const auditLogsResponseDataSchema = z.object({
  logs: z.array(auditLogSchema),
  pagination: z.object({
    current_page: z.number(),
    total: z.number(),
    limit: z.number(),
    pages: z.number(),
    skip: z.number(),
  }),
  search_term: z.string().optional(),
});

export const cleanupResponseSchema = z.object({
  expired_sessions_cleaned: z.number(),
  expired_tokens_cleaned: z.number(),
  expired_otps_cleaned: z.number(),
  cleaned_by: z.string(),
});

export const systemCleanupResponseSchema = z.object({
  cleanup_scheduled: z.boolean(),
  force: z.boolean(),
  scheduled_by: z.string(),
  scheduled_at: z.string(),
});

export type UserDetails = z.infer<typeof userDetailsSchema>;
export type UserDetailsForAdmin = z.infer<typeof userDetailsForAdminSchema>;
export type UsersResponse = z.infer<typeof usersResponseSchema>;
export type GetUserByIdResponse = z.infer<typeof getUserByIdResponseSchema>;
export type AdminDashboard = z.infer<typeof adminDashboardSchema>;
export type AuditLogsResponseData = z.infer<typeof auditLogsResponseDataSchema>;
