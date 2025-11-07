'use client';

import { useI18n } from '@/lib/i18n';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  counts?: Record<string, number>;
  label?: string;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  counts,
  label
}: CategoryTabsProps) {
  const { t } = useI18n();

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
      {label && (
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {label}
          </h3>
        </div>
      )}
      <nav className="flex flex-wrap gap-2 px-4 py-3" aria-label="Tabs">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          const count = counts?.[category];
          const displayCategory = category === 'All' ? t.common.all : category;

          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {displayCategory}
              {count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                  isActive
                    ? 'bg-blue-700 text-blue-100'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
