"use client";

import { FetchClient } from "../lib/api/client";
import { API_ENDPOINTS } from "../constants/routes";
import type { APIResponse } from "../types/auth.types";

export interface SettingsState {
  workspace: {
    defaultView: "grid" | "list";
    autoSave: boolean;
    theme: "light" | "dark";
  };
  editor: {
    fontSize: number;
    spellCheck: boolean;
    grammarCheck: boolean;
    citationFormat: "apa" | "mla" | "chicago";
  };
  ai: {
    complianceChecker: boolean;
    citationRecommendations: boolean;
    argumentLogicChecker: boolean;
  };
  notifications: {
    inApp: boolean;
    taskAlerts: boolean;
  };
  storage: {
    uploadLimit: {
      used: number;
      total: number;
    };
    trashAutoDelete: "7_days" | "30_days" | "60_days" | "never";
  };
}

export interface ProfileData {
  profile: {
    settings_metadata?: SettingsState;
  };
}

export class SettingsService {
  async updateSettings(data: SettingsState): Promise<APIResponse> {
    return FetchClient.makeRequest(API_ENDPOINTS.UPDATE_SETTINGS, {
      method: "PATCH",
      body: JSON.stringify({
        settings_metadata: data,
      }),
    });
  }

  async getSettings(): Promise<APIResponse<ProfileData>> {
    return FetchClient.makeRequest<ProfileData>(API_ENDPOINTS.GET_SETTINGS, {
      method: "GET",
    });
  }
}

export const settingsService = new SettingsService();

