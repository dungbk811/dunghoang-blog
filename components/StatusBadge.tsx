'use client';

import { RoadmapStatus } from '@/lib/roadmap';
import { useI18n } from '@/lib/i18n';

interface StatusBadgeProps {
  status: RoadmapStatus;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { t } = useI18n();

  const configs: Record<RoadmapStatus, { label: string; className: string }> = {
    'planned': {
      label: t.status.planned,
      className: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900',
    },
    'in-progress': {
      label: t.status.inProgress,
      className: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900',
    },
    'completed': {
      label: t.status.completed,
      className: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900',
    },
  };

  const config = configs[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}
