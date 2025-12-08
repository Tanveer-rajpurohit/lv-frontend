import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Plus, Trash } from 'lucide-react';
import svgPaths from '../imports/svg-sgshmz2kzk';
import { useWorkspace } from '../../hooks/useWorkspace';
import type { WorkspaceProject } from '../../services/workspaceService';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: WorkspaceProject | null;
}

export default function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
  const [projectName, setProjectName] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('Document Name');
  const [isUpdating, setIsUpdating] = useState(false);
  const [authorNames, setAuthorNames] = useState<string[]>([]);
  const [instituteName, setInstituteName] = useState('');
  const [supervisorFaculties, setSupervisorFaculties] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState('');
  const [supervisorInput, setSupervisorInput] = useState('');
  const { updateProject } = useWorkspace();

  // Initialize form when project changes
  useEffect(() => {
    if (project) {
      setProjectName(project.title);
      setSelectedDocument(project.category || 'Document Name');
      
      // Extract data from metadata
      const templateData = project.metadata?.template_data?.templateData || project.metadata?.data?.templateData || {};
      setAuthorNames(templateData.authorNames || []);
      setInstituteName(templateData.instituteName || '');
      setSupervisorFaculties(templateData.supervisorFaculties || []);
    }
  }, [project]);

  const handleAddAuthor = () => {
    if (authorInput.trim()) {
      setAuthorNames([...authorNames, authorInput.trim()]);
      setAuthorInput('');
    }
  };

  const handleRemoveAuthor = (index: number) => {
    setAuthorNames(authorNames.filter((_, i) => i !== index));
  };

  const handleAddSupervisor = () => {
    if (supervisorInput.trim()) {
      setSupervisorFaculties([...supervisorFaculties, supervisorInput.trim()]);
      setSupervisorInput('');
    }
  };

  const handleRemoveSupervisor = (index: number) => {
    setSupervisorFaculties(supervisorFaculties.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    if (!project || !projectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    setIsUpdating(true);
    try {
      await updateProject(project.id, {
        title: projectName.trim(),
        category: selectedDocument.toLowerCase().replace(' ', '_'),
        template_data: {
          templateData: {
            authorNames,
            instituteName,
            supervisorFaculties,
          }
        }
      });
      
      onClose();
    } catch (error) {
      alert('Failed to update project. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'linear' }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'linear' }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[10px] w-full max-w-[698px] max-h-[90vh] overflow-y-auto relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-6 sm:p-9">
              {/* Project Name */}
              <div className="mb-8">
                <input
                  type="text"
                  placeholder="Enter Project Name..."
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full text-[24px] sm:text-[30px] text-[#858585] placeholder:text-[#858585] outline-none border-b border-[#bebebe] pb-4"
                  style={{ fontFamily: 'Playfair Display' }}
                />
              </div>

              {/* Document Type Selection */}
              <div className="mb-6">
                <p className="text-[15px] text-center mb-4" style={{ fontFamily: 'Playfair Display' }}>
                  Project Type
                </p>
                <div className="relative">
                  <select
                    value={selectedDocument}
                    onChange={(e) => setSelectedDocument(e.target.value)}
                    className="w-full bg-white border border-[#a2a2a2] rounded-[6px] px-4 py-2 text-[12px] text-center appearance-none cursor-pointer outline-none"
                  >
                    <option value="research_paper">Research Paper</option>
                    <option value="article">Article</option>
                    <option value="assignment">Assignment</option>
                    <option value="ideation">Ideation</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Author Names */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Author Names</label>
                {authorNames.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {authorNames.map((author, index) => (
                      <div key={index} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                        <span className="text-sm">{author}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAuthor(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter author name"
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAuthor();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddAuthor}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Institute Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Institution Name</label>
                <input
                  type="text"
                  placeholder="Enter institution name"
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Supervisor/Faculty */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Supervisor / Faculty</label>
                {supervisorFaculties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {supervisorFaculties.map((supervisor, index) => (
                      <div key={index} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                        <span className="text-sm">{supervisor}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSupervisor(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter supervisor/faculty name"
                    value={supervisorInput}
                    onChange={(e) => setSupervisorInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSupervisor();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSupervisor}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Update Button */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isUpdating}
                  className="px-6 py-3 text-gray-700 border border-gray-300 rounded-[5px] text-[16px] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: isUpdating ? 1 : 1.05 }}
                  whileTap={{ scale: isUpdating ? 1 : 0.95 }}
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className={`bg-black text-white px-8 py-3 rounded-[5px] text-[20px] ${
                    isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{ letterSpacing: '1.4px' }}
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
