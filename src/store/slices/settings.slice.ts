import { create } from "zustand";
import { settingsService, type SettingsState } from "../../services/settings.service";
import type { APIResponse } from "../../types/auth.types";

const DEFAULT_SETTINGS: SettingsState = {
  workspace: {
    defaultView: "grid",
    autoSave: true,
    theme: "light",
  },
  editor: {
    fontSize: 14,
    spellCheck: true,
    grammarCheck: true,
    citationFormat: "chicago",
  },
  ai: {
    complianceChecker: true,
    citationRecommendations: true,
    argumentLogicChecker: true,
  },
  notifications: {
    inApp: true,
    taskAlerts: false,
  },
  storage: {
    uploadLimit: {
      used: 5,
      total: 10,
    },
    trashAutoDelete: "30_days",
  },
};

interface SettingsStoreState {
  settings: SettingsState;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;

  initialize: () => Promise<void>;
  updateSettings: <T extends keyof SettingsState, K extends keyof SettingsState[T]>(
    section: T,
    key: K,
    value: SettingsState[T][K]
  ) => Promise<void>;
  toggleSetting: <T extends keyof SettingsState, K extends keyof SettingsState[T]>(
    section: T,
    key: K
  ) => Promise<void>;
  resetToDefault: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStoreState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  error: null,
  isDirty: false,

  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await settingsService.getSettings();
      if (response.success && response.data?.profile?.settings_metadata) {
        const serverSettings = response.data.profile.settings_metadata;
        const mergedSettings = {
          ...DEFAULT_SETTINGS,
          ...serverSettings,
          workspace: { ...DEFAULT_SETTINGS.workspace, ...serverSettings?.workspace },
          editor: { ...DEFAULT_SETTINGS.editor, ...serverSettings?.editor },
          ai: { ...DEFAULT_SETTINGS.ai, ...serverSettings?.ai },
          notifications: { ...DEFAULT_SETTINGS.notifications, ...serverSettings?.notifications },
          storage: { ...DEFAULT_SETTINGS.storage, ...serverSettings?.storage },
        };
        set({ settings: mergedSettings });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load settings" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSettings: async <T extends keyof SettingsState, K extends keyof SettingsState[T]>(
    section: T,
    key: K,
    value: SettingsState[T][K]
  ) => {
    const currentSettings = get().settings;
    const newSettings = {
      ...currentSettings,
      [section]: {
        ...currentSettings[section],
        [key]: value,
      },
    } as SettingsState;

    set({ settings: newSettings, isDirty: true });

    try {
      await settingsService.updateSettings(newSettings);
      set({ isDirty: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update settings",
        settings: currentSettings,
        isDirty: false,
      });
    }
  },

  toggleSetting: async <T extends keyof SettingsState, K extends keyof SettingsState[T]>(
    section: T,
    key: K
  ) => {
    const currentSettings = get().settings;
    const newSettings = {
      ...currentSettings,
      [section]: {
        ...currentSettings[section],
        [key]: !currentSettings[section][key] as SettingsState[T][K],
      },
    } as SettingsState;

    set({ settings: newSettings, isDirty: true });

    try {
      await settingsService.updateSettings(newSettings);
      set({ isDirty: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to toggle setting",
        settings: currentSettings,
        isDirty: false,
      });
    }
  },

  resetToDefault: async () => {
    const defaultSettingsCopy = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    set({ settings: defaultSettingsCopy, isDirty: true });

    try {
      await settingsService.updateSettings(defaultSettingsCopy);
      set({ isDirty: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to reset settings",
        isDirty: false,
      });
    }
  },
}));

