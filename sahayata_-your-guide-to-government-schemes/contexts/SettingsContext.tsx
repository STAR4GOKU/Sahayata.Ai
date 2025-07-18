
import React, { createContext, useState, useMemo, ReactNode } from 'react';
import { Settings, Language } from '../types';

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  t: (key: string) => string;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

import { TRANSLATIONS } from '../constants';

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>({
    language: 'en',
    isHighContrast: false,
    isLargeText: false,
  });

  const t = useMemo(() => {
    const translations = TRANSLATIONS[settings.language];
    return (key: string) => {
      const keys = key.split('.');
      let result: any = translations;
      for (const k of keys) {
        result = result[k];
        if (result === undefined) {
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
      }
      return result as string;
    };
  }, [settings.language]);

  const value = useMemo(() => ({ settings, setSettings, t }), [settings, t]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
