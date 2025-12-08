import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Folder } from 'lucide-react';
import ProjectCard from './ProjectCard';
import CategoryCard from './CategoryCard';

interface Project {
  id: string;
  title: string;
  category: string;
  authors: { initials: string; color: string }[];
  lastEdited: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface HomeProps {
  projects: Project[];
  categories: Category[];
}

export default function Home({ projects, categories }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const searchResults = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.trim().length > 0);
  };

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
            Welcome, Prabhjot
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
                  {searchResults.length === 0 ? (
                    <div className="p-6 sm:p-8 text-center">
                      <Folder size={40} className="mx-auto mb-3 sm:mb-4 text-gray-300 sm:w-12 sm:h-12" />
                      <p className="text-sm">No projects found</p>
                      <p className="text-xs text-gray-500 mt-1">
                        &quot;{searchQuery}&quot; did not match any projects.
                      </p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {searchResults.map((result) => (
                        <motion.div
                          key={result.id}
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
                              result.category === 'Article' ? 'bg-[#fff9db] text-[#535353]' :
                              result.category === 'Assignment' ? 'bg-[#e3f0fb] text-[#535353]' :
                              'bg-[#e6f4ea] text-[#535353]'
                            }`}>
                              {result.category}
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
          <h3 className="text-2xl sm:text-[30px] mb-4 sm:mb-6" style={{ fontFamily: 'Playfair Display' }}>
            Most Recent
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-8 sm:pb-12">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
