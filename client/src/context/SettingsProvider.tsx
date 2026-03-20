import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';

interface Settings {
  company_email: string;
  company_phone: string;
  company_address: string;
  site_tagline?: string;
  announcement?: string;
}

interface SettingsContextType {
  settings: Settings;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({
    company_email: 'contact@futureindiaexim.com',
    company_phone: '+91 80378 82249',
    company_address: 'Vijayawada, Andhra Pradesh, India - 520013'
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch(getApiUrl('/settings'));
      const data = await res.json();
      if (res.ok && data.data) {
        setSettings(prev => ({ ...prev, ...data.data }));
      }
    } catch (e) {
      console.error('Settings sync error:', e);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch(getApiUrl('/settings'));
        const data = await res.json();
        if (isMounted && res.ok && data.data) {
          setSettings(prev => ({ ...prev, ...data.data }));
        }
      } catch (e) {
        console.error('Settings sync error:', e);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
