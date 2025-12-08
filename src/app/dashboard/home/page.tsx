"use client"

import { useState } from 'react';
import Sidebar from '@/src/components/dashboard/Sidebar';
import Home from '@/src/components/dashboard/home/Home';
import NewProjectModal from '@/src/components/dashboard/NewProjectModal';

// Data
const categories = [
  { id: 'ideation', name: 'Ideation', icon: '💡' },
  { id: 'research', name: 'Research Paper', icon: '📚' },
  { id: 'assignment', name: 'College Assignment', icon: '🎓' },
  { id: 'article', name: 'Article', icon: '📰' },
];

const projects = [
  {
    id: '1',
    title: 'AoA of Lawvriksh',
    category: 'Assignment',
    authors: [{ initials: 'RK', color: '#ffc4c4' }],
    lastEdited: '10 minutes ago',
  },
  {
    id: '2',
    title: 'AoA of Lawvriksh',
    category: 'Research Paper',
    authors: [
      { initials: 'RK', color: '#ffc4c4' },
      { initials: 'RR', color: '#ebcbff' },
      { initials: 'RR', color: '#c8ffce' },
      { initials: '+1', color: '#efefef' },
    ],
    lastEdited: '10 minutes ago',
  },
  {
    id: '3',
    title: 'My Personal',
    category: 'Article',
    authors: [
      { initials: 'RK', color: '#ffc4c4' },
      { initials: 'RR', color: '#ebcbff' },
      { initials: 'RR', color: '#c8ffce' },
      { initials: '+1', color: '#efefef' },
    ],
    lastEdited: '10 minutes ago',
  },
  {
    id: '4',
    title: 'My Personal',
    category: 'Article',
    authors: [
      { initials: 'RK', color: '#ffc4c4' },
      { initials: 'RR', color: '#ebcbff' },
      { initials: 'RR', color: '#c8ffce' },
      { initials: '+1', color: '#efefef' },
    ],
    lastEdited: '10 minutes ago',
  },
  {
    id: '5',
    title: 'My Personal',
    category: 'Article',
    authors: [
      { initials: 'RK', color: '#ffc4c4' },
      { initials: 'RR', color: '#ebcbff' },
      { initials: 'RR', color: '#c8ffce' },
      { initials: '+1', color: '#efefef' },
    ],
    lastEdited: '10 minutes ago',
  },
  {
    id: '6',
    title: 'AoA of Lawvriksh',
    category: 'Research Paper',
    authors: [{ initials: 'RK', color: '#ffc4c4' }],
    lastEdited: '10 minutes ago',
  },
  {
    id: '7',
    title: 'AoA of Lawvriksh',
    category: 'Research Paper',
    authors: [
      { initials: 'RK', color: '#ffc4c4' },
      { initials: 'RR', color: '#ebcbff' },
      { initials: 'RR', color: '#c8ffce' },
      { initials: '+1', color: '#efefef' },
    ],
    lastEdited: '10 minutes ago',
  },
  {
    id: '8',
    title: 'My Personal',
    category: 'Article',
    authors: [
      { initials: 'RK', color: '#ffc4c4' },
      { initials: 'RR', color: '#ebcbff' },
      { initials: 'RR', color: '#c8ffce' },
      { initials: '+1', color: '#efefef' },
    ],
    lastEdited: '10 minutes ago',
  },
];

export default function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        isExpanded={isSidebarExpanded}
        activeNav={activeNav}
        onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
        onNavClick={setActiveNav}
        onNewProject={() => setIsNewProjectModalOpen(true)}
      />
      
      <Home categories={categories} />
      
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
}
