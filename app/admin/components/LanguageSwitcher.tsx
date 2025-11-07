'use client';

import { useAdminLanguage } from '@/contexts/AdminLanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useAdminLanguage();

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-1">
      <button
        onClick={() => setLanguage('vi')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          language === 'vi'
            ? 'bg-purple-600 text-white'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        🇻🇳 VI
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          language === 'en'
            ? 'bg-purple-600 text-white'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => setLanguage('ja')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          language === 'ja'
            ? 'bg-purple-600 text-white'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        🇯🇵 JP
      </button>
    </div>
  );
}
