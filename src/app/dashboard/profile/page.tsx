"use client";

import { useState, useCallback, useMemo } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import Loader from "@/src/components/ui/Loader";
import Sidebar from "@/src/components/dashboard/Sidebar";
import NewProjectModal from "@/src/components/dashboard/NewProjectModal";
import Profile from "../../../components/profile/Profile";

export default function ProfilePage() {
  const { profile, isInitialLoading } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeNav, setActiveNav] = useState("profile");
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

  if (isInitialLoading || !profile) {
    return <Loader message="Loading Profile..." />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isExpanded={isExpanded}
        activeNav={activeNav}
        onToggle={handleToggle}
        onNavClick={handleNavClick}
        onNewProject={handleNewProject}
      />
      <main className="flex-1 overflow-y-auto bg-white">
        <Profile user={profile} />
      </main>
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
}

