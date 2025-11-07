'use client';

import { useAdminLanguage } from '@/contexts/AdminLanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function SettingsPage() {
  const { t } = useAdminLanguage();

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t.settings.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.settings.description}
        </p>
      </div>

      {/* Settings Sections */}
      <div className="max-w-4xl space-y-6">
        {/* Language Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t.settings.languageTitle}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t.settings.languageDescription}
              </p>
              <LanguageSwitcher />
            </div>
            <div className="ml-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
          </div>
        </div>

        {/* More settings can be added here */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t.settings.appearanceTitle}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.settings.appearanceDescription}
              </p>
            </div>
            <div className="ml-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
