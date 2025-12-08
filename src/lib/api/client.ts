"use client";

import { APIResponse } from "../../types/auth.types";
import { STORAGE_KEYS } from "../../constants/storage-keys";
import { useAuthStore } from "../../store/slices/auth.slice";

class FetchClientImpl {
  private baseURL: string;

  constructor() {
    const envURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    // Ensure we have a valid baseURL
    if (envURL) {
      // Remove trailing slashes and ensure it has protocol
      this.baseURL = envURL.trim().replace(/\/+$/, "");
      if (!this.baseURL.startsWith("http://") && !this.baseURL.startsWith("https://")) {
        this.baseURL = `http://${this.baseURL}`;
      }
    } else {
      // Use relative URL to leverage Next.js API rewrites and avoid CORS
      this.baseURL = "";
    }
    
    // Validate baseURL doesn't contain localhost:3000
    if (this.baseURL.includes("localhost:3000")) {
      console.error("ERROR: baseURL contains localhost:3000! Using fallback.");
      this.baseURL = "";
    }
  }

  async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    // Clean endpoint - remove any accidental localhost:3000 or localhost:8000 from endpoint
    let cleanEndpoint = endpoint.trim();
    
    // Remove any full URL patterns from endpoint (shouldn't happen, but safety check)
    cleanEndpoint = cleanEndpoint.replace(/^https?:\/\/[^\/]+/, "");
    cleanEndpoint = cleanEndpoint.replace(/^\/+/, ""); // Remove leading slashes
    
    // If endpoint is already a full URL, use it directly (but validate it)
    let url: string;
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
      url = endpoint;
      // Safety check: reject if it contains localhost:3000
      if (url.includes("localhost:3000")) {
        throw new Error(`Invalid URL contains localhost:3000: ${url}`);
      }
    } else {
      // Construct URL from baseURL and endpoint
      const cleanBaseURL = this.baseURL.replace(/\/+$/, "");
      url = cleanBaseURL ? `${cleanBaseURL}/${cleanEndpoint}` : `/api/${cleanEndpoint}`;
    }
    
    // Final validation - reject if URL contains localhost:3000
    if (url.includes("localhost:3000")) {
      console.error("ERROR: Final URL contains localhost:3000!", { baseURL: this.baseURL, endpoint, finalURL: url });
      throw new Error(`Invalid URL constructed: ${url}. BaseURL: ${this.baseURL}, Endpoint: ${endpoint}`);
    }
    
    // Debug log to help identify issues
    if (typeof window !== "undefined") {
      console.log("API Request:", { baseURL: this.baseURL, endpoint, finalURL: url });
    }

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        "ngrok-skip-browser-warning": "true",
      },
      ...options,
    };

    if (typeof window !== "undefined") {
      // Get token from Zustand store first (most reliable)
      // Fallback to localStorage if store not initialized
      let token: string | null = null;
      
      try {
        const authState = useAuthStore.getState();
        if (authState.tokens?.access_token) {
          token = authState.tokens.access_token;
        }
      } catch {
        // Store might not be initialized, fallback to localStorage
      }
      
      // Fallback to localStorage if token not in store
      if (!token) {
        token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || localStorage.getItem('access_token');
      }
      
      if (token) {
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get("content-type") || "";
      let data: any = null;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { raw: text };
        }
      }

      if (!response.ok) {
        const errMsg =
          data?.detail ||
          data?.message ||
          data?.error ||
          (typeof data === "string" ? data : JSON.stringify(data)) ||
          "Request failed";
        const error: any = new Error(errMsg);
        error.status = response.status;
        error.body = data;
        throw error;
      }

      if (data && typeof data.success === "boolean") {
        return data;
      }

      return { success: true, data } as unknown as APIResponse<T>;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }
}

export const FetchClient = new FetchClientImpl();
