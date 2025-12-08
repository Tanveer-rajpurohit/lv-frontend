import { motion } from 'framer-motion';
import { MoreVertical, Trash2, Edit, Share, Download, Eye } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { WorkspaceProject } from '../../services/workspaceService';

interface ProjectCardProps {
  project: WorkspaceProject;
  onDelete?: (projectId: string) => void;
  onEdit?: (project: WorkspaceProject) => void;
  onShare?: (projectId: string) => void;
  onExport?: (projectId: string) => void;
}

const categoryColors: Record<string, string> = {
  'Article': 'bg-[#fff9db] text-[#535353]',
  'Assignment': 'bg-[#e3f0fb] text-[#535353]',
  'Research paper': 'bg-[#e6f4ea] text-[#535353]',
  'Research_paper': 'bg-[#e6f4ea] text-[#535353]',
  'Ideation': 'bg-[#f3f4f6] text-[#535353]',
  'assignment': 'bg-[#e3f0fb] text-[#535353]',
  'article': 'bg-[#fff9db] text-[#535353]',
  'research_paper': 'bg-[#e6f4ea] text-[#535353]',
  'ideation': 'bg-[#f3f4f6] text-[#535353]',
};

export default function ProjectCard({ project, onDelete, onEdit, onShare, onExport }: ProjectCardProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleCardClick = () => {
    router.push(`/writing-section/${project.id}`);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    console.log('Delete button clicked for project:', project.id);
    if (onDelete && confirm('Are you sure you want to delete this project?')) {
      console.log('Calling onDelete with project ID:', project.id);
      onDelete(project.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(project);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(project.id);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(project.id);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Extract authors from metadata (check both old and new data structures)
  const authors = 
    project.metadata?.data?.templateData?.authorNames || 
    project.metadata?.template_data?.templateData?.authorNames || 
    [];
  
  // Format category name
  const formatCategory = (category: string) => {
    if (!category) return 'Uncategorized';
    return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get author colors
  const getAuthorColor = (index: number) => {
    const colors = ['#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd'];
    return colors[index % colors.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3, ease: 'linear' }}
      className="group relative bg-white border border-[#e8e8e6] rounded-lg p-4 sm:p-6 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Three-dot menu */}
      <div className="absolute top-3 right-3" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <MoreVertical size={16} className="text-gray-600" />
        </button>

        {/* Dropdown menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMenuAction(handleCardClick);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              <Eye size={14} />
              Open
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMenuAction(handleEdit);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              <Edit size={14} />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMenuAction(handleShare);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              <Share size={14} />
              Share
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMenuAction(handleExport);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              <Download size={14} />
              Export
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMenuAction(handleDelete);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </motion.div>
        )}
      </div>

      <h3 className="text-lg sm:text-xl mb-2 sm:mb-3 pr-20" style={{ fontFamily: 'Playfair Display' }}>
        {project.title}
      </h3>

      <div className="h-px bg-[#c4ad77] mb-3 sm:mb-4" />

      <div className="mb-3">
        <p className="text-[#565656] text-xs mb-2">Authors:</p>
        <div className="flex gap-1">
          {authors.slice(0, 3).map((author: string, idx: number) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1, ease: 'linear' }}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] text-[#666666] border border-white"
              style={{ backgroundColor: getAuthorColor(idx) }}
            >
              {author.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
            </motion.div>
          ))}
          {authors.length > 3 && (
            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
              +{authors.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span className={`px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] whitespace-nowrap ${
          categoryColors[formatCategory(project.category)] || 'bg-gray-100'
        }`}>
          {formatCategory(project.category)}
        </span>
        <p className="text-[9px] sm:text-[10px] text-[#656565]">Last edited: {formatDate(project.updated_at)}</p>
      </div>

      {project.access_type && (
        <div className="mt-2">
          <span className={`text-xs px-2 py-1 rounded ${
            project.access_type === 'private' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'
          }`}>
            {project.access_type}
          </span>
        </div>
      )}
    </motion.div>
  );
}
