'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { locales, type Locale, type LocaleKeys } from './locales';

interface I18nStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: LocaleKeys;
}

// Detect browser language
function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return 'vi';

  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('en')) return 'en';
  return 'vi';
}

export const useI18n = create<I18nStore>()(
  persist(
    (set, get) => {
      // Always use 'vi' as default for SSR consistency
      const defaultLocale: Locale = 'vi';
      return {
        locale: defaultLocale,
        setLocale: (locale: Locale) =>
          set({
            locale,
            t: locales[locale] as LocaleKeys,
          }),
        t: locales[defaultLocale] as LocaleKeys,
      };
    },
    {
      name: 'i18n-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure t is updated after rehydration
          state.t = locales[state.locale] as LocaleKeys;
        } else {
          // Only detect browser locale on client after hydration if no saved preference
          if (typeof window !== 'undefined') {
            const browserLocale = getBrowserLocale();
            return { locale: browserLocale, t: locales[browserLocale] as LocaleKeys };
          }
        }
      },
    }
  )
);

// Helper function for components
export function getTranslations(locale: Locale = 'vi') {
  return locales[locale];
}
