import { useEffect, useRef } from "react";
import { useSettingsStore } from "../store/slices/settings.slice";

export function useSettings() {
  const store = useSettingsStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Initialize settings on mount if not already initialized and not loading
    if (!hasInitialized.current && !store.isLoading) {
      hasInitialized.current = true;
      store.initialize();
    }
  }, [store.isLoading, store]);

  return {
    settings: store.settings,
    updateSettings: store.updateSettings,
    toggleSetting: store.toggleSetting,
    resetToDefault: store.resetToDefault,
    isDirty: store.isDirty,
    isLoading: store.isLoading,
    error: store.error,
  };
}

