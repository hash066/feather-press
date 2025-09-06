import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_SETTINGS, SiteSettings, loadSettings, saveSettings, applyTheme, applyFavicon } from '@/lib/utils';

type SettingsContextValue = {
  settings: SiteSettings;
  updateSettings: (partial: Partial<SiteSettings>) => void;
  resetSettings: () => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const s = loadSettings();
    setSettings(s);
    applyTheme(s);
    if (s.faviconDataUrl) applyFavicon(s.faviconDataUrl);
  }, []);

  useEffect(() => {
    saveSettings(settings);
    applyTheme(settings);
    if (settings.faviconDataUrl) applyFavicon(settings.faviconDataUrl);
  }, [settings]);

  const updateSettings = useCallback((partial: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const resetSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  const value = useMemo(() => ({ settings, updateSettings, resetSettings }), [settings, updateSettings, resetSettings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}


