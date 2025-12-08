import { useSubscriptionStore } from "../store/slices/subscription.slice";

export function useSubscription() {
  return useSubscriptionStore();
}

