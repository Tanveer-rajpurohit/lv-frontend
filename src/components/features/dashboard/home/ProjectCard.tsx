import { motion } from 'framer-motion';

interface Author {
  initials: string;
  color: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  authors: Author[];
  lastEdited: string;
}

const categoryColors: Record<string, string> = {
  Article: 'bg-[#fff9db] text-[#535353]',
  Assignment: 'bg-[#e3f0fb] text-[#535353]',
  'Research Paper': 'bg-[#e6f4ea] text-[#535353]',
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3, ease: 'linear' }}
      className="bg-white border border-[#e8e8e6] rounded-lg p-4 sm:p-6 cursor-pointer"
    >
      <h3 className="text-lg sm:text-xl mb-2 sm:mb-3" style={{ fontFamily: 'Playfair Display' }}>
        {project.title}
      </h3>
      
      <div className="h-px bg-[#c4ad77] mb-3 sm:mb-4" />
      
      <div className="mb-3">
        <p className="text-[#565656] text-xs mb-2">Authors:</p>
        <div className="flex gap-1">
          {project.authors.map((author, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1, ease: 'linear' }}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] text-[#666666] border border-white"
              style={{ backgroundColor: author.color }}
            >
              {author.initials}
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span className={`px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] whitespace-nowrap ${
          categoryColors[project.category] || 'bg-gray-100'
        }`}>
          {project.category}
        </span>
        <p className="text-[9px] sm:text-[10px] text-[#656565]">Last edited: {project.lastEdited}</p>
      </div>
    </motion.div>
  );
}
