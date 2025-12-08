import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import svgPaths from '../../imports/svg-sgshmz2kzk';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const [projectName, setProjectName] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('Document Name');

  const handleCreate = () => {
    console.log('Creating project:', projectName, selectedDocument);
    setProjectName('');
    setSelectedDocument('Document Name');
    onClose();
  };

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

              {/* From Scratch */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#f1f1f1] rounded-[5px] p-8 sm:p-12 flex flex-col items-center justify-center cursor-pointer mb-6"
              >
                <div className="w-[42px] h-[42px] mb-4">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
                    <path d={svgPaths.p1d8c4480} fill="#1D1B20" />
                  </svg>
                </div>
                <p className="text-[18px]" style={{ fontFamily: 'Playfair Display' }}>From Scratch</p>
              </motion.div>

              {/* Upload Template */}
              <div className="bg-white border-2 border-dashed border-black rounded-[5px] p-8 sm:p-12 flex flex-col items-center justify-center mb-6">
                <div className="w-[32px] h-[32px] mb-4">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                    <path d={svgPaths.p3ab19300} stroke="#09090B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <p className="text-[18px] text-center" style={{ fontFamily: 'Playfair Display' }}>
                  Choose your Own Template
                </p>
              </div>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#a3a3a3]" />
                </div>
                <div className="relative bg-white px-4">
                  <p className="text-[20px] text-[#a2a2a2]">OR</p>
                </div>
              </div>

              {/* Select From Existing */}
              <div className="mb-8">
                <p className="text-[15px] text-center mb-4" style={{ fontFamily: 'Playfair Display' }}>
                  Select From existing
                </p>
                <div className="relative">
                  <select
                    value={selectedDocument}
                    onChange={(e) => setSelectedDocument(e.target.value)}
                    className="w-full bg-white border border-[#a2a2a2] rounded-[6px] px-4 py-2 text-[12px] text-center appearance-none cursor-pointer outline-none"
                  >
                    <option>Document Name</option>
                    <option>AoA of Lawvriksh</option>
                    <option>My Personal</option>
                    <option>Research Paper 1</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Create Button */}
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreate}
                  className="bg-black text-white px-8 py-3 rounded-[5px] text-[20px]"
                  style={{ letterSpacing: '1.4px' }}
                >
                  Create
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
