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
