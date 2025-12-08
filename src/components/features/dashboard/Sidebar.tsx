import { motion } from 'framer-motion';
import { Home, BookOpen, History, Trash2, Settings, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SidebarProps {
  isExpanded: boolean;
  activeNav: string;
  onToggle: () => void;
  onNavClick: (id: string) => void;
  onNewProject: () => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'reference', label: 'Reference Manager', icon: BookOpen },
  { id: 'history', label: 'History', icon: History },
];

export default function Sidebar({ isExpanded, activeNav, onToggle, onNavClick, onNewProject }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Set initial width immediately on first render
    if (sidebarRef.current) {
      gsap.set(sidebarRef.current, { width: isExpanded ? 269 : 80 });
      
      // Animate to new state
      gsap.to(sidebarRef.current, {
        width: isExpanded ? 269 : 80,
        duration: 0.4,
        ease: "power2.inOut" // Use smooth easing for better animation
      });
    }

    // Animate nav items with stagger
    navItemRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.fromTo(ref, 
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3, delay: index * 0.05, ease: "power2.out" }
        );
      }
    });

    // Animate toggle button rotation
    if (toggleButtonRef.current) {
      gsap.to(toggleButtonRef.current, {
        rotation: isExpanded ? 180 : 0,
        duration: 0.3,
        ease: "power2.inOut"
      });
    }
  }, [isExpanded]);

  const handleNavHover = (element: HTMLButtonElement | null, isHovering: boolean) => {
    if (element) {
      if (isHovering) {
        gsap.to(element, {
          backgroundColor: "rgba(241, 245, 249, 0.8)",
          duration: 0.2,
          ease: "power2.out"
        });
      } else {
        gsap.to(element, {
          backgroundColor: "transparent",
          duration: 0.2,
          ease: "power2.out"
        });
      }
    }
  };
  return (
    <aside
      ref={sidebarRef}
      className="relative h-screen border-r border-[#d6d7d0] bg-white flex flex-col z-50 flex-shrink-0 overflow-hidden"
      style={{ width: 80 }} // Start with collapsed width
    >
      {/* Logo Section */}
      <div className="p-5 pb-0 flex items-center justify-between">
        <div>
          {isExpanded ? (
            <>
              <h1 className="text-[30px]" style={{ fontFamily: 'Baskerville Old Face' }}>
                LawVriksh
              </h1>
              <div className="h-0.5 bg-[#d4af37] w-[129px] mt-1" />
            </>
          ) : (
            <div className="flex justify-center w-full">
              <h1 className="text-2xl" style={{ fontFamily: 'Baskerville Old Face' }}>LV</h1>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button - Fixed Position */}
      <div className="absolute right-2 top-6">
        <button
          ref={toggleButtonRef}
          onClick={onToggle}
          className="bg-white border border-[#d6d7d0] rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
          title={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          <ChevronLeft size={16} className="text-[#393634]" />
        </button>
      </div>

      {/* New Project Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNewProject}
        className={`mx-3 mt-8 bg-[rgba(245,245,244,0.58)] border border-stone-300 rounded-lg py-3 ${
          isExpanded ? 'px-4 gap-3' : 'px-3 justify-center'
        } flex items-center text-[#393634] transition-all duration-300 hover:bg-stone-100`}
        title={!isExpanded ? 'New Project' : ''}
      >
        <Plus size={20} />
        {isExpanded && <span>New Project</span>}
      </motion.button>

      {/* Navigation */}
      <nav className="mt-6 flex-1 overflow-y-auto">
        {navItems.map((item, index) => (
          <button
            key={item.id}
            ref={(el) => {
              navItemRefs.current[index] = el;
            }}
            onMouseEnter={() => handleNavHover(navItemRefs.current[index], true)}
            onMouseLeave={() => handleNavHover(navItemRefs.current[index], false)}
            onClick={() => onNavClick(item.id)}
            className={`w-full flex items-center ${
              isExpanded ? 'gap-3 px-6' : 'justify-center px-3'
            } py-3 text-[#393634] transition-colors ${
              activeNav === item.id ? 'bg-stone-50' : ''
            }`}
            title={!isExpanded ? item.label : ''}
          >
            <item.icon size={20} />
            {isExpanded && <span className="whitespace-nowrap">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-stone-200 p-4 space-y-3">
        <button
          className={`w-full flex items-center ${
            isExpanded ? 'gap-3 px-2' : 'justify-center'
          } py-2 text-[#393634] hover:bg-stone-50 rounded transition-all`}
          title={!isExpanded ? 'Trash Bin' : ''}
        >
          <Trash2 size={20} />
          {isExpanded && <span>Trash Bin</span>}
        </button>
        <button
          className={`w-full flex items-center ${
            isExpanded ? 'gap-3 px-2' : 'justify-center'
          } py-2 text-[#393634] hover:bg-stone-50 rounded transition-all`}
          title={!isExpanded ? 'Settings' : ''}
        >
          <Settings size={20} />
          {isExpanded && <span>Settings</span>}
        </button>
        {isExpanded ? (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-6 h-6 rounded-full bg-stone-300 flex items-center justify-center">
              <span className="text-xs font-semibold text-stone-600">P</span>
            </div>
            <span className="text-[#393634] text-sm truncate">prabhjotjaswal08</span>
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <div className="w-8 h-8 rounded-full bg-stone-300 flex items-center justify-center" title="prabhjotjaswal08">
              <span className="text-sm font-semibold text-stone-600">P</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
