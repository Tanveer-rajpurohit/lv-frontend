import { FetchClient } from '../lib/api/client';
import { API_ENDPOINTS } from '../constants/routes';

export interface WorkspaceProject {
  id: string;
  title: string;
  category: 'ideation' | 'research_paper' | 'assignment' | 'article';
  access_type: 'private' | 'public';
  metadata?: {
    data?: {
      templateData?: {
        authorNames?: string[];
      };
    };
    template_data?: {
      templateData?: {
        authorNames?: string[];
        documentType?: string;
        creationType?: string;
        files?: Array<{ name: string; size: number; type: string }>;
      };
    };
  };
  updated_at: string;
  created_at: string;
  user_id: string;
}

export interface CreateProjectRequest {
  title: string;
  category: string;
  access_type?: 'private' | 'public';
  template_data?: any;
}

export interface SearchProjectRequest {
  query: string;
  limit?: number;
  offset?: number;
}

export interface SearchProject {
  id: string;
  title: string;
  category: string;
  updated_at: string;
  relevance_score?: number;
}

class WorkspaceService {
  private client = FetchClient;

  // Get all workspace projects
  async getWorkspaceProjects(userId?: string): Promise<WorkspaceProject[]> {
    try {
      const response = await this.client.makeRequest(API_ENDPOINTS.WORKSPACES, {
        method: 'GET',
      });

      if (response.success) {
        // Handle the actual API response format
        const responseData = response.data as any;
        return responseData.workspaces || [];
      }
      throw new Error(response.message || 'Failed to fetch projects');
    } catch (error) {
      console.error('Error fetching workspace projects:', error);
      throw error;
    }
  }

  // Create a new project
  async createProject(data: CreateProjectRequest): Promise<WorkspaceProject> {
    try {
      const response = await this.client.makeRequest(API_ENDPOINTS.CREATE_PROJECT, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.success) {
        // Handle the actual API response format
        const responseData = response.data as any;
        return responseData.workspace || responseData;
      }
      throw new Error(response.message || 'Failed to create project');
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  // Update a project
  async updateProject(projectId: string, data: Partial<CreateProjectRequest>): Promise<WorkspaceProject> {
    try {
      const response = await this.client.makeRequest(`${API_ENDPOINTS.UPDATE_PROJECT}/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (response.success) {
        return response.data as WorkspaceProject;
      }
      throw new Error(response.message || 'Failed to update project');
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  // Delete a project (move to trash)
  async deleteProject(projectId: string): Promise<void> {
    try {
      const response = await this.client.makeRequest(`${API_ENDPOINTS.DELETE_PROJECT}/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // Permanently delete a project
  async permanentlyDeleteProject(projectId: string): Promise<void> {
    try {
      const response = await this.client.makeRequest(`${API_ENDPOINTS.DELETE_PROJECT}/${projectId}/permanent`, {
        method: 'DELETE',
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to permanently delete project');
      }
    } catch (error) {
      console.error('Error permanently deleting project:', error);
      throw error;
    }
  }

  // Search projects
  async searchProjects(data: SearchProjectRequest): Promise<SearchProject[]> {
    try {
      const response = await this.client.makeRequest(API_ENDPOINTS.SEARCH_PROJECTS, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.success) {
        // Handle the actual API response format
        const responseData = response.data as any;
        return responseData.workspaces || [];
      }
      throw new Error(response.message || 'Failed to search projects');
    } catch (error) {
      console.error('Error searching projects:', error);
      throw error;
    }
  }

  // Export project
  async exportProject(projectId: string, format?: string): Promise<Blob> {
    try {
      const url = format 
        ? `${API_ENDPOINTS.EXPORT_PROJECT}/${projectId}?format=${format}`
        : `${API_ENDPOINTS.EXPORT_PROJECT}/${projectId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export project');
      }

      return response.blob();
    } catch (error) {
      console.error('Error exporting project:', error);
      throw error;
    }
  }

  // Get project by ID
  async getProjectById(projectId: string): Promise<WorkspaceProject> {
    try {
      const response = await this.client.makeRequest(`${API_ENDPOINTS.GET_PROJECT_BY_ID}/${projectId}`, {
        method: 'GET',
      });

      if (response.success) {
        return response.data as WorkspaceProject;
      }
      throw new Error(response.message || 'Failed to fetch project');
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }
}

export const workspaceService = new WorkspaceService();
