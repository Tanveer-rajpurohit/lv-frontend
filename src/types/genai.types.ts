// For /genai/risk-evaluate
export interface DeviceData {
    device_id?: string;
    device_type?: string;
    screen_resolution?: string;
    timezone?: string;
    user_agent?: string;
    language?: string;
    additional_info?: DeviceAdditionalInfo;
    mouse_movements?: DeviceMovementData[];
    form_completion_time?: number;
}

export interface DeviceAdditionalInfo {
    additionalProp1?: any;
}

export interface DeviceMovementData {
    additionalProp1?: number;
    additionalProp2?: number;
    additionalProp3?: number;
}

export interface LocationData {
    country: string;
    city: string;
    region?: string;
    latitude?: number;
    longitude?: number;
}

export interface RiskEvaluateRequest {
    mouse_movements: { x: number, y: number, timestamp: number }[];
    completion_time_seconds: number;
    email: string;
    device_info: DeviceData;
    event_type: 'registration' | 'login';
}

// For /genai/score
export interface ProfileDataForScore {
    name: string;
    profession: string;
    education: string;
    experience_years: number;
}
