"use client";

import { useState, useCallback, useMemo } from "react";
import { LayoutDashboard, Settings2, Bot, RotateCcw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSettings } from "@/src/hooks/useSettings";
import { useAuth } from "@/src/hooks/useAuth";
import Loader from "@/src/components/ui/Loader";
import Sidebar from "@/src/components/dashboard/Sidebar";
import NewProjectModal from "@/src/components/dashboard/NewProjectModal";

type SectionKey = "workspace" | "editor" | "ai";

interface NavItemConfig {
  id: SectionKey;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: "workspace", label: "Workspace Preferences", icon: LayoutDashboard },
  { id: "editor", label: "Editor Settings", icon: Settings2 },
  { id: "ai", label: "AI Assistance", icon: Bot },
];

export default function SettingsPage() {
  const { profile, isInitialLoading } = useAuth();
  const { settings, updateSettings, toggleSetting, resetToDefault, isDirty, isLoading: settingsLoading } = useSettings();
  const [activeSection, setActiveSection] = useState<SectionKey>("workspace");
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeNav, setActiveNav] = useState("settings");
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const handleNavClick = useCallback((section: SectionKey) => {
    setActiveSection(section);
  }, []);

  const handleToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleSidebarNavClick = useCallback((id: string) => {
    setActiveNav(id);
  }, []);

  const handleNewProject = useCallback(() => {
    setIsNewProjectModalOpen(true);
  }, []);

  if (isInitialLoading || !profile) {
    return <Loader message="Loading..." />;
  }

  if (settingsLoading && !settings) {
    return <Loader message="Loading settings..." />;
  }

  const renderCurrentSection = () => {
    switch (activeSection) {
      case "workspace":
        return (
          <section key="workspace" id="workspace" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-[#393634]">Workspace Preference</h2>
              <p className="text-gray-600">Choose how your workspace looks and behaves by default.</p>
            </div>

            <div className="space-y-4">
              <ToggleControl
                label="Auto-save"
                description="Automatically save documents while you edit."
                checked={settings.workspace.autoSave}
                onChange={() => toggleSetting("workspace", "autoSave")}
              />
            </div>
          </section>
        );

      case "editor":
        return (
          <section key="editor" id="editor" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-[#393634]">Editor Settings</h2>
              <p className="text-gray-600">Configure how the writing editor behaves while you work.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="font-size" className="block text-sm font-medium mb-2 text-[#393634]">
                  Font Size
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="font-size"
                    type="range"
                    min={10}
                    max={20}
                    value={settings.editor.fontSize}
                    onChange={(event) =>
                      updateSettings("editor", "fontSize", Number(event.target.value) as 10 | 12 | 14 | 16 | 18 | 20)
                    }
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-12">{settings.editor.fontSize}px</span>
                </div>
              </div>

              <ToggleControl
                label="Spell Check"
                checked={settings.editor.spellCheck}
                onChange={() => toggleSetting("editor", "spellCheck")}
              />

              <ToggleControl
                label="Grammar Check"
                checked={settings.editor.grammarCheck}
                onChange={() => toggleSetting("editor", "grammarCheck")}
              />
            </div>
          </section>
        );

      case "ai":
        return (
          <section key="ai" id="ai" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-[#393634]">AI Assistance</h2>
              <p className="text-gray-600">Enable intelligent checks that support your legal writing workflow.</p>
            </div>

            <div className="space-y-4">
              <ToggleControl
                label="Compliance Checker"
                description="Monitor drafts for compliance gaps and risky language."
                checked={settings.ai.complianceChecker}
                onChange={() => toggleSetting("ai", "complianceChecker")}
              />
              <ToggleControl
                label="Fact Recommendation"
                description="Fact recommendations based on the content."
                checked={settings.ai.citationRecommendations}
                onChange={() => toggleSetting("ai", "citationRecommendations")}
              />
              <ToggleControl
                label="Argument Logic Checker"
                description="Highlight logical inconsistencies and weak arguments."
                checked={settings.ai.argumentLogicChecker}
                onChange={() => toggleSetting("ai", "argumentLogicChecker")}
              />
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isExpanded={isExpanded}
        activeNav={activeNav}
        onToggle={handleToggle}
        onNavClick={handleSidebarNavClick}
        onNewProject={handleNewProject}
      />
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="flex h-full">
          <aside className="w-64 border-r border-stone-200 p-6">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeSection === id
                    ? "bg-stone-100 text-[#393634]"
                    : "text-gray-600 hover:bg-stone-50"
                }`}
                onClick={() => handleNavClick(id)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </aside>

          <div className="flex-1 p-8">
            <header className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-[#393634]">Settings</h1>
                <p className="text-gray-600">
                  Fine-tune your workspace preferences, editor behaviour, and AI assistance.
                </p>
              </div>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={resetToDefault}
                disabled={!isDirty}
              >
                <RotateCcw size={16} />
                <span>Reset to Default</span>
              </button>
            </header>

            <div>{renderCurrentSection()}</div>
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

interface ToggleControlProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}

function ToggleControl({ label, description, checked, onChange }: ToggleControlProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-stone-200 rounded-lg">
      <div>
        <span className="block text-sm font-medium text-[#393634]">{label}</span>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-stone-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#393634]"></div>
      </label>
    </div>
  );
}

