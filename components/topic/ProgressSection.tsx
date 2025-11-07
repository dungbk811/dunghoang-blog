'use client';

import { Progress } from '@/lib/roadmap';
import { useI18n } from '@/lib/i18n';

interface ProgressSectionProps {
  progress: Progress;
}

export default function ProgressSection({ progress }: ProgressSectionProps) {
  const { t } = useI18n();
  const { percentage, totalHours, completedHours, lastUpdated } = progress;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        📊 {t.topic.progressOverview}
      </h2>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {percentage}%
          </span>
          {totalHours && completedHours !== undefined && (
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {completedHours}h / {totalHours}h {t.topic.hoursCompleted}
            </span>
          )}
        </div>
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <p className="text-sm text-slate-500 dark:text-slate-500">
          {t.topic.lastUpdated}: {new Date(lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      )}
    </div>
  );
}
