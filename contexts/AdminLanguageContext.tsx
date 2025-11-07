'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import enTranslations from '@/translations/admin/en.json';
import viTranslations from '@/translations/admin/vi.json';
import jaTranslations from '@/translations/admin/ja.json';

type Language = 'en' | 'vi' | 'ja';

type Translations = typeof enTranslations;

interface AdminLanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined);

const translations: Record<Language, Translations> = {
  en: enTranslations,
  vi: viTranslations,
  ja: jaTranslations,
};

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi'); // Default to Vietnamese

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('adminLanguage') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'vi' || savedLang === 'ja')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('adminLanguage', lang);
  };

  const value: AdminLanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <AdminLanguageContext.Provider value={value}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext);
  if (context === undefined) {
    throw new Error('useAdminLanguage must be used within AdminLanguageProvider');
  }
  return context;
}
