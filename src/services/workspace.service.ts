"use client";

import { FetchClient } from "../lib/api/client";
import { API_ENDPOINTS } from "../constants/routes";
import type { APIResponse } from "../types/auth.types";

export interface WorkspaceProject {
  id: string;
  user_id: string;
  title: string;
  category: string;
  metadata: { data: any };
  content: { data: any };
  access_type: string;
  updated_at: string;
}

export interface TrashedProjectsResponse {
  workspaces: WorkspaceProject[];
}

export class WorkspaceService {
  async getTrashedProjects(page: number = 1, limit: number = 100): Promise<APIResponse<TrashedProjectsResponse>> {
    return FetchClient.makeRequest<TrashedProjectsResponse>(
      `${API_ENDPOINTS.GET_TRASHED_PROJECTS}?page=${page}&limit=${limit}`,
      {
        method: "GET",
      }
    );
  }

  async restoreProject(projectId: string): Promise<APIResponse> {
    return FetchClient.makeRequest(`${API_ENDPOINTS.RESTORE_PROJECT}/${projectId}`, {
      method: "POST",
    });
  }
}

export const workspaceService = new WorkspaceService();

