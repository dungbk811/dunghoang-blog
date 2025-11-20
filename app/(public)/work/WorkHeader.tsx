'use client';

import { useI18n } from '@/lib/i18n';
import { WorkRole } from '@/lib/roadmap';
import { rolesSettings } from '@/lib/profile';

interface WorkHeaderProps {
  onSearchToggle: () => void;
  isSearchOpen: boolean;
  role?: WorkRole;
  category?: string;
}

export default function WorkHeader({
  onSearchToggle,
  isSearchOpen,
  role,
  category,
}: WorkHeaderProps) {
  const { t } = useI18n();

  // If category-filtered, show generic title
  if (category && !role) {
    return (
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 tracking-tight">
            💼 {category}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            Tất cả công việc trong danh mục này
          </p>
        </div>
        <button
          onClick={onSearchToggle}
          className={`flex-shrink-0 p-3 rounded-lg transition-all ${
            isSearchOpen
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          aria-label="Toggle search and filters"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    );
  }

  // Role-specific header
  const roleConfig = rolesSettings[role || 'COO'];
  const subtitleMap: Record<WorkRole, string> = {
    COO: t.coo.subtitle,
    CPO: t.cpo.subtitle,
    CFO: t.cfo.subtitle,
    CLO: t.clo.subtitle,
  };

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 tracking-tight">
          {roleConfig.icon} {roleConfig.label}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          {subtitleMap[role || 'COO']}
        </p>
      </div>
      <button
        onClick={onSearchToggle}
        className={`flex-shrink-0 p-3 rounded-lg transition-all ${
          isSearchOpen
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
        aria-label="Toggle search and filters"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
}
