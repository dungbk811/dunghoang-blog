'use client';

import { RoadmapStatus } from '@/lib/roadmap';
import { useI18n } from '@/lib/i18n';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatuses: RoadmapStatus[];
  onStatusToggle: (status: RoadmapStatus) => void;
  sortBy: 'date' | 'title';
  onSortChange: (sort: 'date' | 'title') => void;
}

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedStatuses,
  onStatusToggle,
  sortBy,
  onSortChange,
}: SearchAndFilterProps) {
  const { t } = useI18n();

  const statuses: { value: RoadmapStatus; label: string }[] = [
    { value: 'planned', label: t.status.planned },
    { value: 'in-progress', label: t.status.inProgress },
    { value: 'completed', label: t.status.completed },
  ];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder={t.common.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2.5 pl-10 pr-10 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Status and Sort Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {t.common.status}:
          </span>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => onStatusToggle(status.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedStatuses.includes(status.value)
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {t.common.sort}:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'date' as const, label: t.sort.date },
              { value: 'title' as const, label: t.sort.title },
            ].map((sort) => (
              <button
                key={sort.value}
                onClick={() => onSortChange(sort.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  sortBy === sort.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
