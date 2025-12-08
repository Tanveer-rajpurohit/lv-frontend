"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Trash2, BookOpen } from "lucide-react";
import { useWorkspace } from "@/src/hooks/useWorkspace";
import { useSettings } from "@/src/hooks/useSettings";
import { useAuth } from "@/src/hooks/useAuth";
import Loader from "@/src/components/ui/Loader";
import Sidebar from "@/src/components/dashboard/Sidebar";
import NewProjectModal from "@/src/components/dashboard/NewProjectModal";

interface TrashedItem {
  id: string;
  title: string;
  authors: Array<{ name: string; color: string }>;
  tags: Array<{ name: string; color: string }>;
  lastEdited: string;
  type: string;
}

export default function TrashBinPage() {
  const { profile, isInitialLoading } = useAuth();
  const { settings } = useSettings();
  const { trashedProjects, fetchTrashedProjects, restoreProject, isLoading } = useWorkspace();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeNav, setActiveNav] = useState("trash-bin");
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleNavClick = useCallback((id: string) => {
    setActiveNav(id);
  }, []);

  const handleNewProject = useCallback(() => {
    setIsNewProjectModalOpen(true);
  }, []);

  // Prevent infinite loop by adding a ref to track if fetch has been called
  const hasFetched = useRef(false);
  useEffect(() => {
    if (profile && !isLoading && !trashedProjects && !hasFetched.current) {
      hasFetched.current = true;
      fetchTrashedProjects();
    }
  }, [profile, isLoading, trashedProjects, fetchTrashedProjects]);

  // Reset fetch flag when component unmounts or when dependencies change
  useEffect(() => {
    return () => {
      hasFetched.current = false;
    };
  }, [profile]);

  if (isInitialLoading || !profile) {
    return <Loader message="Loading..." />;
  }

  if (isLoading && !trashedProjects) {
    return <Loader message="Loading trash bin..." />;
  }

  const getTrashPeriodText = () => {
    const period = settings.storage.trashAutoDelete;
    switch (period) {
      case "7_days":
        return "Last 7 days";
      case "30_days":
        return "Last 30 days";
      case "60_days":
        return "Last 60 days";
      case "never":
        return "All Trashed Items";
      default:
        return "Last 30 days";
    }
  };

  const handleRestore = async (projectId: string) => {
    await restoreProject(projectId);
  };

  const formatLastEdited = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const getAuthorsData = (project: any) => {
    const authorNames = project.metadata?.data?.templateData?.authorNames || [];

    if (authorNames.length === 0) {
      return [{ name: `Subject: ${project.category || "Unknown"}`, color: "" }];
    }

    const colors = ["#BBF7D0", "#FED7AA", "#FBCFE8", "#DDD6FE", "#BFDBFE"];
    return [
      { name: "Author and Co-Author", color: "" },
      ...authorNames.map((name: string, idx: number) => ({
        name,
        color: colors[idx % colors.length],
      })),
    ];
  };

  const trashedItems: TrashedItem[] = (trashedProjects || []).map((project) => ({
    id: project.id,
    title: project.title || "Untitled",
    authors: getAuthorsData(project),
    tags: [],
    lastEdited: formatLastEdited(project.updated_at),
    type:
      project.category === "research_paper"
        ? "Research Paper"
        : project.category === "assignment"
        ? "Assignment"
        : project.category === "article"
        ? "Article"
        : "Document",
  }));

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isExpanded={isExpanded}
        activeNav={activeNav}
        onToggle={handleToggle}
        onNavClick={handleNavClick}
        onNewProject={handleNewProject}
      />
      <main className="flex-1 overflow-y-auto bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Trash2 size={28} className="text-[#393634]" />
                <h1 className="text-3xl font-semibold text-[#393634]">Trash Bin</h1>
              </div>
              <span className="text-sm text-gray-600">{getTrashPeriodText()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trashedItems.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <Trash2 size={64} className="mx-auto mb-4 opacity-30 text-gray-400" />
                <h3 className="text-xl font-medium mb-2 text-gray-600">No items in trash</h3>
                <p className="text-gray-500">Your trash bin is empty</p>
              </div>
            ) : (
              trashedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-4 text-[#393634]">{item.title}</h3>
                  <div className="border-t border-stone-200 mb-4"></div>
                  <div className="space-y-3 mb-4">
                    {item.authors.filter((a) => a.color).length > 0 ? (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen size={18} className="text-gray-500" />
                          <span className="text-sm text-gray-600">Author and Co-Author:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.authors
                            .filter((a) => a.color)
                            .map((author, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{ backgroundColor: author.color }}
                              >
                                {author.name}
                              </span>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <BookOpen size={18} className="text-gray-500" />
                        <span className="text-sm text-gray-600">{item.authors[0].name}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                    {item.type && (
                      <span className="px-3 py-1 bg-stone-100 text-xs font-medium rounded text-[#393634]">
                        {item.type}
                      </span>
                    )}
                    <button
                      onClick={() => handleRestore(item.id)}
                      className="px-4 py-2 bg-[#393634] text-white text-sm font-medium rounded hover:bg-[#2a2725] transition-colors"
                    >
                      Restore
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
}

