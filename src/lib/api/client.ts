import { APIResponse } from "../../types/auth.types";
import { STORAGE_KEYS } from "../../constants/storage-keys";

class FetchClientImpl {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
  }

  async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    const url = `${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        "ngrok-skip-browser-warning": "true",
      },
      ...options,
    };

    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
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
