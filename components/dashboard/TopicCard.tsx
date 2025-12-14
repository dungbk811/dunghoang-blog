'use client';

import { RoadmapItem } from '@/lib/roadmap';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

interface TopicCardProps {
  item: RoadmapItem;
  postCount: number;
  type: 'learning' | 'coo';
}

export default function TopicCard({ item, postCount, type }: TopicCardProps) {
  // Work items share /work-item/[id] detail page regardless of role
  const detailUrl = `/${type === 'learning' ? 'learning' : 'work-item'}/${item.id}`;
  const { t } = useI18n();

  return (
    <Link href={detailUrl} className="group block h-full">
      <article className="h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="flex-1 text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition-colors leading-snug">
            {item.title}
          </h3>
          <StatusBadge status={item.status} />
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-5 flex-grow">
          {item.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">
            {item.category}
          </span>
          <div className="flex items-center gap-1.5">
            <svg className={`w-3.5 h-3.5 ${postCount > 0 ? 'text-emerald-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className={`text-xs font-medium ${postCount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
              {postCount} {postCount === 1 ? t.learning.post : t.learning.posts}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
