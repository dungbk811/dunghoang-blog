'use client';

import { Subtask } from '@/lib/roadmap';
import StatusBadge from '@/components/StatusBadge';
import { useI18n } from '@/lib/i18n';

interface SubtasksListProps {
  subtasks: Subtask[];
}

export default function SubtasksList({ subtasks }: SubtasksListProps) {
  const { t } = useI18n();
  const sortedSubtasks = [...subtasks].sort((a, b) => a.order - b.order);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in-progress':
        return '→';
      case 'planned':
        return '○';
      default:
        return '○';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        ✅ {t.topic.learningTasks}
      </h2>

      <div className="space-y-3">
        {sortedSubtasks.map((subtask) => (
          <div
            key={subtask.id}
            className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
              subtask.status === 'completed'
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                : subtask.status === 'in-progress'
                ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                subtask.status === 'completed'
                  ? 'bg-emerald-600 text-white'
                  : subtask.status === 'in-progress'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
              }`}
            >
              {getStatusIcon(subtask.status)}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className={`font-medium ${
                    subtask.status === 'completed'
                      ? 'text-emerald-900 dark:text-emerald-100 line-through'
                      : subtask.status === 'in-progress'
                      ? 'text-amber-900 dark:text-amber-100'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {subtask.order}. {subtask.title}
                </h3>
              </div>
              {subtask.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {subtask.description}
                </p>
              )}
            </div>
            <StatusBadge status={subtask.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
