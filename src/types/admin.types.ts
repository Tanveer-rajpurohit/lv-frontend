export type ApplicationStatus = 'pending' | 'approved' | 'rejected';
export type UserRole = "user" | "student" | "professional" | "admin";

export interface ApplicationsResponse {
    applications: CreatorApplication[];
    total: number;
    skip: number;
    limit: number;
    filter_status?: string;
}

export interface UsersResponse {
    users: UserDetails[];
    pagination: {
        current_page: number;
        total: number;
        limit: number;
        pages: number;
        skip: number;
    };
}

export interface AddUserRequest {
    email?: string;
    name?: string;
    username?: string;
    role?: UserRole;
    password?: string;
}

export interface UserDetails {
    user_id: string,
    email: string,
    name: string,
    username: string,
    role: UserRole,
    status: "active" | "suspended" | "banned" | "deleted",
    is_verified: boolean,
    is_profile_complete: boolean,
    risk_score: number,
    spam_score: number,
    created_at: string,
    last_login: string,
    login_attempts: number
}

export interface GetUserByIdResponse {
    user: UserDetailsForAdmin;
    sessions: UserSessionDetails[];
    recent_activity: RecentActivity[];
    timestamp?: string;
}

export interface RecentActivity {
    action: string,
    description: string,
    ip_address: string,
    created_at: string
}

export interface UserSessionDetails {
    session_id: string,
    user_id: string,
    ip_address: string,
    created_at: string,
    last_active: string,
    is_active: boolean
}

export interface UserDetailsForAdmin {
    user_id: string,
    email: string,
    name: string,
    username: string,
    picture: string,
    provider: string,
    role: UserRole,
    status: "active" | "suspended" | "banned" | "deleted",
    is_verified: boolean,
    two_fa_enabled: boolean,
    is_profile_complete: boolean,
    risk_score: number,
    spam_score: number,
    login_attempts: number,
    created_at: string,
    updated_at: string,
    last_login: string
}

//user action 
export interface UserActionRequest {
    user_id: string,
    action: "suspend" | "ban" | "delete" | "restore",
    reason: string,
    duration_hours: number,
}

export interface UserActionResponse {
    user_id: string,
    action: string,
    reason: string,
    duration_hours: number,
    actioned_at: string,
    actioned_by: string
}

//suspend user
export interface SuspendUserRequest {
    user_id: string,
    reason: string,
    duration_days: number,
    notify_user: boolean
}

export interface SuspendUserResponse {
    user_id: string,
    status: "suspended",
    reason: string,
    suspended_until: string,
    suspended_at: string,
    suspended_by: string
}

//restore
export interface RestoreUserRequest {
    user_id: string,
    reason: string,
    notify_user: boolean
}

export interface RestoreUserResponse {
    user_id: string,
    status: "active",
    restored_at: string,
    restored_by: string,
    restoration_reason: string
}

// Interface for System Information
export interface SystemInfo {
    database_type: string;
    redis_enabled: boolean;
    authentication_method: string;
    rate_limiting_enabled: boolean;
    '2fa_enabled': boolean;
    risk_assessment_enabled: boolean;
    spam_detection_enabled: boolean;
}

// Interface for User Statistics
export interface UserStats {
    total_users: number;
    users_by_role: {
        user: number;
        creator: number;
        admin: number;
    };
    users_by_status: {
        active: number;
        suspended: number;
        banned: number;
        deleted: number;
    };
    users_by_provider: {
        email: number;
        google: number;
    };
    new_users_period: number;
    verified_users: number;
    users_with_2fa: number;
    completed_profiles: number;
}

// Interface for Session Statistics
export interface SessionStats {
    total_sessions: number;
    active_sessions: number;
    sessions_period: number;
    avg_session_duration: string;
}

// Interface for Token Statistics
export interface TokenStats {
    total_refresh_tokens: number;
    active_refresh_tokens: number;
    revoked_tokens: number;
}

// Interface for OTP Statistics
export interface OTPStats {
    total_otps: number;
    active_otps: number;
    used_otps: number;
    otps_period: number;
}

// Interface for Application Statistics
export interface ApplicationStats {
    total_applications: number;
    pending_applications: number;
    approved_applications: number;
    rejected_applications: number;
    flagged_applications: number;
    applications_period: number;
}

// Interface for Creator Statistics
export interface CreatorStats {
    total_creators: number;
    active_creators: number;
    verified_creators: number;
    avg_subscribers_per_creator: number;
}

// Interface for Subscription Statistics
export interface SubscriptionStats {
    total_subscriptions: number;
    active_subscriptions: number;
    subscriptions_period: number;
}

// Interface for Notification Statistics
export interface NotificationStats {
    total_notifications: number;
    unread_notifications: number;
    notifications_period: number;
}

// Interface for Security Statistics
export interface SecurityStats {
    high_risk_users: number;
    medium_risk_users: number;
    low_risk_users: number;
    high_spam_users: number;
    failed_logins_period: number;
}

// Main interface for the entire stats object
export interface SystemStats {
    period_days: number;
    generated_at: string;
    system_info: SystemInfo;
    user_stats: UserStats;
    session_stats: SessionStats;
    token_stats: TokenStats;
    otp_stats: OTPStats;
    application_stats: ApplicationStats;
    creator_stats: CreatorStats;
    subscription_stats: SubscriptionStats;
    notification_stats: NotificationStats;
    security_stats: SecurityStats;
}

// Admin Dashboard interfaces
export interface AdminInfo {
    admin_id: string;
    admin_name: string;
    admin_email: string;
    last_login: string;
    dashboard_generated_at: string;
}

export interface UserOverview {
    total_users: number;
    active_users: number;
    suspended_users: number;
    banned_users: number;
    new_users_today: number;
    new_users_week: number;
    growth_rate_week: number;
}

export interface SecurityOverview {
    high_risk_users: number;
    medium_risk_users: number;
    high_spam_users: number;
    recent_rate_limits_1h: number;
    blocked_ips_24h: number;
    security_score: number;
}

export interface CreatorOverview {
    total_creators: number;
    active_creators: number;
    pending_applications: number;
    flagged_applications: number;
    applications_today: number;
    approval_rate: number;
}

export interface SystemOverview {
    active_sessions: number;
    sessions_today: number;
    total_subscriptions: number;
    subscriptions_today: number;
    unread_notifications: number;
    notifications_today: number;
}

export interface SystemActivity {
    error?: string;
}

export interface QuickAction {
    name: string;
    endpoint: string;
    count: number;
    priority: 'low' | 'medium' | 'high';
}

export interface RecentActivities {
    flagged_applications: any[];
    high_risk_users: any[];
}

export interface AdminDashboard {
    admin_info: AdminInfo;
    user_overview: UserOverview;
    security_overview: SecurityOverview;
    creator_overview: CreatorOverview;
    system_overview: SystemOverview;
    system_activity: SystemActivity;
    priority_alerts: any[];
    recent_activities: RecentActivities;
    quick_actions: QuickAction[];
}

export interface ReviewApplicationRequest {
    status: 'approved' | 'rejected';
    review_notes?: string;
}

export interface CleanupResponse {
    expired_sessions_cleaned: number;
    expired_tokens_cleaned: number;
    expired_otps_cleaned: number;
    cleaned_by: string;
}

//audit logs
export interface AuditLog {
    id: string;
    user_id: string | null;
    admin_id?: string | null; // Optional
    action: string;
    description: string;
    ip_address: string;
    user_agent?: string; // Optional
    metadata?: Record<string, any>; // Flexible metadata
    created_at: string;
    user_email: string | null;
    admin_email?: string | null; // Optional
}

export interface AuditLogsResponseData {
    logs: AuditLog[];
    pagination: {
        current_page: number;
        total: number;
        limit: number;
        pages: number;
        skip: number;
    };
    search_term?: string; // Optional for the search endpoint
}

//update user score
export interface UpdateUserScore {
    user_id: string,
    risk_score: number,
    spam_score: number,
    profile_score: number,
    reason: string
}

//update user role
export interface UpdateUserRole {
    user_id: string,
    new_role: UserRole,
    reason: string
}

//system health
export interface SystemHealth {
    health: {
        overall_status: string,
        timestamp: string,
        services: {
            database: {
                status: string,
                error: string
            },
            redis: {
                status: string,
                error: string
            }
        },
        metrics: {
            total_users: number,
            active_sessions: number,
            pending_applications: number,
            system_load: string
        },
        alerts: string[]
    }
}

//system cleanup
export interface SystemCleanupResponse {
    cleanup_scheduled: boolean,
    force: boolean,
    scheduled_by: string,
    scheduled_at: string
}

// Creator Application interface
export interface CreatorApplication {
    id: string;
    user_id: string;
    name: string;
    email: string;
    category: string;
    experience_years: number;
    portfolio_url: string;
    bio: string;
    status: ApplicationStatus;
    created_at: string;
    updated_at: string;
    reviewed_at?: string;
    reviewed_by?: string;
    review_notes?: string;
}
