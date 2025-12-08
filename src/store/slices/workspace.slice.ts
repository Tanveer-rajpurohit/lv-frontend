import { create } from "zustand";
import type { WorkspaceProject, SearchProject } from "../../services/workspaceService";

interface WorkspaceState {
  // Projects
  projects: WorkspaceProject[] | null;
  searchedProjects: SearchProject[] | null;
  trashedProjects: WorkspaceProject[] | null;
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;

  // Actions
  setProjects: (projects: WorkspaceProject[] | null) => void;
  addProject: (project: WorkspaceProject) => void;
  updateProject: (project: WorkspaceProject) => void;
  removeProject: (projectId: string) => void;
  setSearchedProjects: (projects: SearchProject[] | null) => void;
  setTrashedProjects: (projects: WorkspaceProject[] | null) => void;
  removeTrashedProject: (projectId: string) => void;
  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  // Initial state
  projects: null,
  searchedProjects: null,
  trashedProjects: null,
  isLoading: false,
  isCreating: false,
  error: null,

  // Actions
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({
    projects: state.projects ? [...state.projects, project] : [project]
  })),
  updateProject: (updatedProject) => set((state) => ({
    projects: state.projects?.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    ) || null
  })),
  removeProject: (projectId) => set((state) => ({
    projects: state.projects?.filter(project => project.id !== projectId) || null
  })),
  setSearchedProjects: (searchedProjects) => set({ searchedProjects }),
  setTrashedProjects: (trashedProjects) => set({ trashedProjects }),
  removeTrashedProject: (projectId) => set((state) => ({
    trashedProjects: state.trashedProjects?.filter(project => project.id !== projectId) || null
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setCreating: (isCreating) => set({ isCreating }),
  setError: (error) => set({ error }),
}));

