import React, { useState, useEffect } from 'react';
import { LanguageContext, translations, getCurrencyConfig } from './LanguageContext';
import type { Language } from './LanguageContext';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('lang') as Language) || 'EN';
  });

  useEffect(() => {
    localStorage.setItem('lang', language);
    document.documentElement.dir = language === 'AR' ? 'rtl' : 'ltr';
    document.documentElement.lang = language.toLowerCase();
    
    // Trigger Google Translate Widget
    const setGoogleTrans = (lang: Language) => {
      const code = lang === 'EN_IN' ? 'en' : lang.toLowerCase();
      // Set the Google Trans cookie
      document.cookie = `goog-trans=/en/${code}; path=/; domain=${window.location.hostname}`;
      document.cookie = `goog-trans=/en/${code}; path=/;`;
      
      // Also try to trigger the internal combo if it exists
      const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (combo) {
        combo.value = code;
        combo.dispatchEvent(new Event('change'));
      }
    };

    setGoogleTrans(language);
  }, [language]);

  const t = (key: string) => {
    return translations[language]?.[key] || translations['EN']?.[key] || key;
  };

  const formatCurrency = (amount: number) => {
    const config = getCurrencyConfig(language);
    const converted = amount * config.rate;
    return new Intl.NumberFormat(language === 'HI' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatCurrency }}>
      {children}
    </LanguageContext.Provider>
  );
};
