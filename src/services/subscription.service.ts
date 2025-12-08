"use client";

import { FetchClient } from "../lib/api/client";
import { API_ENDPOINTS } from "../constants/routes";
import type { APIResponse } from "../types/auth.types";

export interface SubscriptionFeedback {
  user_id: string;
  subscription_type: string;
}

export class SubscriptionService {
  async sendSubscriptionFeedback(data: SubscriptionFeedback): Promise<APIResponse> {
    return FetchClient.makeRequest(API_ENDPOINTS.SEND_FEEDBACK, {
      method: "PATCH",
      body: JSON.stringify({
        subscription_metadata: data,
      }),
    });
  }
}

export const subscriptionService = new SubscriptionService();

