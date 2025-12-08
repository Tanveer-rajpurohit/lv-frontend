import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Folder } from 'lucide-react';
import ProjectCard from '../ProjectCard';
import NewProjectModal from '../NewProjectModal';
import EditProjectModal from '../EditProjectModal';
import CategoryCard from './CategoryCard';
import { useWorkspace } from '../../../hooks/useWorkspace';
import { useAuth } from '../../../hooks/useAuth';
import Loader from '../../../components/ui/Loader';
import type { WorkspaceProject } from '../../../services/workspaceService';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface HomeProps {
  categories: Category[];
}

export default function Home({ categories }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<WorkspaceProject | null>(null);
  const { profile } = useAuth();
  const { 
    projects, 
    searchedProjects,
    isLoading, 
    error, 
    fetchProjects, 
    deleteProject, 
    exportProject,
    searchProjects 
  } = useWorkspace();
  
  const hasFetched = useRef(false);

  // Fetch projects on component mount
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchProjects();
    }
  }, [fetchProjects]);

  // Handle search
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.trim().length > 0);

    if (query.trim().length > 0) {
      try {
        await searchProjects({ query, limit: 10 });
      } catch (error) {
        // Search failed silently
      }
    }
  }, [searchProjects]);

  // Handle project actions
  const handleDeleteProject = useCallback(async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        // Project will be automatically removed from the store
      } catch (error) {
        alert('Failed to delete project. Please try again.');
      }
    }
  }, [deleteProject]);

  const handleExportProject = useCallback(async (projectId: string) => {
    try {
      await exportProject(projectId, 'pdf');
    } catch (error) {
      // Export failed silently
    }
  }, [exportProject]);

  const handleShareProject = useCallback((projectId: string) => {
    // Implement share functionality
    const url = `${window.location.origin}/writing-section/${projectId}`;
    navigator.clipboard.writeText(url);
    alert('Project link copied to clipboard!');
  }, []);

  const handleEditProject = useCallback((project: WorkspaceProject) => {
    setEditingProject(project);
    setIsEditProjectModalOpen(true);
  }, []);



  // Display projects (search results or all projects)
  const displayProjects = isSearching && searchedProjects ? searchedProjects : projects;
  console.log(displayProjects)
  // Always show the main UI after initial load attempt
  const shouldShowMainUI = !isLoading || hasFetched.current;

  if (isLoading && !hasFetched.current) {
    return <Loader message="Loading projects..." />;
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 left-0 right-0 h-[600px] sm:h-[800px] pointer-events-none overflow-hidden">
          <img src="/assets/images/dashboard/db63189bf151558253ec7d655ce74d1100403a06.png" alt="" className="w-full h-full object-cover opacity-[0.77]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
        </div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
            <p className="text-red-600 mb-4">Failed to load projects</p>
            <p className="text-gray-600 mb-4 text-sm">{error}</p>
            <button 
              onClick={() => {
                hasFetched.current = false;
                fetchProjects();
              }}
              className="px-4 py-2 bg-[#393634] text-white rounded hover:bg-[#2a2725] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto relative">
      {/* Background Image */}
      <div className="absolute top-0 left-0 right-0 h-[600px] sm:h-[800px] pointer-events-none overflow-hidden">
        <img src="/assets/images/dashboard/db63189bf151558253ec7d655ce74d1100403a06.png" alt="" className="w-full h-full object-cover opacity-[0.77]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
      </div>

      <div className="relative z-10 px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'linear' }}
          className="mb-8 sm:mb-12"
        >
          <h2
            className="text-2xl sm:text-3xl lg:text-[40px] text-center mb-4 sm:mb-6 px-4"
            style={{ fontFamily: 'Playwrite US Trad' }}
          >
            Welcome, {profile?.name || profile?.username || 'User'}
          </h2>

          {/* Search Bar */}
          <div className="relative max-w-[876px] mx-auto z-50">
            <div className="bg-white rounded-[39px] shadow-md border border-stone-100 flex items-center px-4 sm:px-6 py-2.5 sm:py-3">
              <Search size={20} className="text-[#868686] sm:w-6 sm:h-6" />
              <input
                type="text"
                placeholder="Search in this workspace..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 ml-3 sm:ml-4 outline-none text-sm sm:text-[15px] text-[#393634] placeholder:text-[#868686]"
              />
            </div>

            {/* Search Results */}
            <AnimatePresence>
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: 'linear' }}
                  className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-xl border border-stone-200 max-h-[400px] overflow-y-auto z-50"
                >
                  {!displayProjects || !Array.isArray(displayProjects) || displayProjects.length === 0 ? (
                    <div className="p-6 sm:p-8 text-center">
                      <Folder size={40} className="mx-auto mb-3 sm:mb-4 text-gray-300 sm:w-12 sm:h-12" />
                      <p className="text-sm">No projects found</p>
                      <p className="text-xs text-gray-500 mt-1">
                        "{searchQuery}" did not match any projects.
                      </p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {displayProjects.slice(0, 5).map((result: any) => (
                        <motion.div
                          key={result.id || `search-${Math.random()}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 hover:bg-stone-50 rounded cursor-pointer gap-2"
                        >
                          <div className="flex items-center gap-3">
                            <Folder size={16} className="text-gray-400" />
                            <span className="text-sm">{result.title}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-4">
                            <span className={`px-2 py-1 rounded-full text-[9px] whitespace-nowrap ${
                              result.category === 'article' ? 'bg-[#fff9db] text-[#535353]' :
                              result.category === 'assignment' ? 'bg-[#e3f0fb] text-[#535353]' :
                              result.category === 'research_paper' ? 'bg-[#e6f4ea] text-[#535353]' :
                              'bg-[#f3f4f6] text-[#535353]'
                            }`}>
                              {result.category.replace('_', ' ')}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 relative z-10">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>

        {/* Most Recent Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, ease: 'linear' }}
          className="relative z-20 bg-white rounded-t-3xl -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-2xl sm:text-[30px]" style={{ fontFamily: 'Playfair Display' }}>
              Most Recent
            </h3>
            {isLoading && (
              <div className="text-sm text-gray-500">Loading...</div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-8 sm:pb-12">
            {!displayProjects || displayProjects.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <Folder size={64} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-medium mb-2 text-gray-600">No projects yet</h3>
                <p className="text-gray-500 mb-6">Create your first project to get started</p>
                <button 
                  onClick={() => setIsNewProjectModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#393634] text-white rounded-lg hover:bg-[#2a2725] transition-colors mx-auto"
                >
                  <Plus size={16} />
                  Create Project
                </button>
              </div>
            ) : (
              Array.isArray(displayProjects) && displayProjects.map((project: any) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleDeleteProject}
                  onEdit={handleEditProject}
                  onExport={handleExportProject}
                  onShare={handleShareProject}
                />
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* New Project Modal */}
      <NewProjectModal 
        isOpen={isNewProjectModalOpen} 
        onClose={() => setIsNewProjectModalOpen(false)} 
      />

      {/* Edit Project Modal */}
      <EditProjectModal 
        isOpen={isEditProjectModalOpen} 
        onClose={() => {
          setIsEditProjectModalOpen(false);
          setEditingProject(null);
        }}
        project={editingProject}
      />
    </main>
  );
}
