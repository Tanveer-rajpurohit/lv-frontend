import { create } from "zustand";
import { subscriptionService, type SubscriptionFeedback } from "../../services/subscription.service";
import type { APIResponse } from "../../types/auth.types";

interface SubscriptionState {
  isLoading: boolean;
  error: string | null;

  sendFeedback: (data: SubscriptionFeedback) => Promise<APIResponse>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  isLoading: false,
  error: null,

  sendFeedback: async (data: SubscriptionFeedback) => {
    set({ isLoading: true, error: null });
    try {
      const response = await subscriptionService.sendSubscriptionFeedback(data);
      if (!response.success) {
        set({ error: response.message || "Failed to send feedback" });
      }
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send feedback";
      set({ error: errorMessage });
      return {
        success: false,
        message: errorMessage,
      } as APIResponse;
    } finally {
      set({ isLoading: false });
    }
  },
}));

