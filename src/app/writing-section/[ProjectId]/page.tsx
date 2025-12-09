'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/src/components/dashboard/Sidebar';
import WritingSection from '../../../components/writing-section/WritingSection';
import AnalysisSidebar from '../../../components/writing-section/AnalysisSidebar';

export default function WritingSectionPage() {
  const params = useParams();
  const projectId = params.ProjectId as string;
  
  const [isLeftSidebarExpanded, setIsLeftSidebarExpanded] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isToolbarSticky, setIsToolbarSticky] = useState(false);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(553);
  const [isResizing, setIsResizing] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const scrollContainer = document.querySelector('.editor-scroll-container');
    if (scrollContainer) {
      const scrollTop = scrollContainer.scrollTop;
      
      // Hide header after scrolling 50px
      if (scrollTop > 50) {
        setIsHeaderVisible(false);
        setIsToolbarSticky(true);
      } else {
        setIsHeaderVisible(true);
        setIsToolbarSticky(false);
      }
    }
  }, []);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      // Set min and max width constraints
      const constrainedWidth = Math.min(Math.max(newWidth, 306), 800);
      setRightSidebarWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="writing-app-container flex h-screen w-full bg-white overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar 
        isExpanded={isLeftSidebarExpanded}
        activeNav=""
        onToggle={() => setIsLeftSidebarExpanded(!isLeftSidebarExpanded)}
        onNavClick={() => {}}
        onNewProject={() => {}}
      />

      {/* Main Content Area with Right Sidebar */}
      <div className="main-and-sidebar-wrapper flex flex-1 overflow-hidden">
        {/* Writing Section */}
        <WritingSection
          isHeaderVisible={isHeaderVisible}
          isToolbarSticky={isToolbarSticky}
          onScroll={handleScroll}
        />

        {/* Right Sidebar - Analysis Panel */}
        <AnalysisSidebar
          width={rightSidebarWidth}
          onResizeStart={handleResizeStart}
          isResizing={isResizing}
        />
      </div>
    </div>
  );
}
