import { useEffect, useCallback } from "react";
import { useWorkspaceStore } from "../store/slices/workspace.slice";
import { workspaceService } from "../services/workspaceService";
import type { CreateProjectRequest, SearchProjectRequest } from "../services/workspaceService";

export function useWorkspace() {
  const store = useWorkspaceStore();

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    store.setLoading(true);
    store.setError(null);
    try {
      const projects = await workspaceService.getWorkspaceProjects();
      store.setProjects(projects);
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Failed to fetch projects');
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  // Create a new project
  const createProject = useCallback(async (data: CreateProjectRequest) => {
    store.setCreating(true);
    store.setError(null);
    try {
      const newProject = await workspaceService.createProject(data);
      store.addProject(newProject);
      return newProject;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Failed to create project');
      throw error;
    } finally {
      store.setCreating(false);
    }
  }, [store]);

  // Update a project
  const updateProject = useCallback(async (projectId: string, data: Partial<CreateProjectRequest>) => {
    store.setLoading(true);
    store.setError(null);
    try {
      const updatedProject = await workspaceService.updateProject(projectId, data);
      store.updateProject(updatedProject);
      return updatedProject;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Failed to update project');
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  // Delete a project (move to trash)
  const deleteProject = useCallback(async (projectId: string) => {
    store.setLoading(true);
    store.setError(null);
    try {
      await workspaceService.deleteProject(projectId);
      store.removeProject(projectId);
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Failed to delete project');
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  // Permanently delete a project
  const permanentlyDeleteProject = useCallback(async (projectId: string) => {
    store.setLoading(true);
    store.setError(null);
    try {
      await workspaceService.permanentlyDeleteProject(projectId);
      store.removeProject(projectId);
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Failed to permanently delete project');
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  // Search projects
  const searchProjects = useCallback(async (data: SearchProjectRequest) => {
    store.setLoading(true);
    store.setError(null);
    try {
      const results = await workspaceService.searchProjects(data);
      store.setSearchedProjects(results);
      return results;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Failed to search projects');
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  // Export project
  const exportProject = useCallback(async (projectId: string, format?: string) => {
    try {
      const blob = await workspaceService.exportProject(projectId, format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project-${projectId}.${format || 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return blob;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Failed to export project');
      throw error;
    }
  }, [store]);

  // Get project by ID
  const getProjectById = useCallback(async (projectId: string) => {
    store.setLoading(true);
    store.setError(null);
    try {
      const project = await workspaceService.getProjectById(projectId);
      return project;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Failed to fetch project');
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  // Fetch trashed projects
  const fetchTrashedProjects = useCallback(async () => {
    store.setLoading(true);
    store.setError(null);
    try {
      const projects = await workspaceService.getWorkspaceProjects();
      // Filter projects that are in trash (you might need to add a 'is_trashed' field to the API)
      const trashedProjects = projects.filter(project => (project as any).is_trashed);
      store.setTrashedProjects(trashedProjects);
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Failed to fetch trashed projects');
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  // Restore project from trash
  const restoreProject = useCallback(async (projectId: string) => {
    store.setLoading(true);
    store.setError(null);
    try {
      await workspaceService.updateProject(projectId, { is_trashed: false } as any);
      store.removeTrashedProject(projectId);
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Failed to restore project');
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  return {
    ...store,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    permanentlyDeleteProject,
    searchProjects,
    exportProject,
    getProjectById,
    fetchTrashedProjects,
    restoreProject,
  };
}

