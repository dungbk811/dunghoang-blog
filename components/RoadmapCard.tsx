import Link from 'next/link';
import { RoadmapItem } from '@/lib/roadmap';
import StatusBadge from './StatusBadge';

interface RoadmapCardProps {
  item: RoadmapItem;
  type: 'learning' | 'coo';
  postCount: number;
}

export default function RoadmapCard({ item, type, postCount }: RoadmapCardProps) {
  const hasTarget = item.targetDate;

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all p-6 shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={item.status} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {item.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span className="text-xs font-medium">{item.category}</span>
        </div>

        {postCount > 0 ? (
          <Link
            href={`/${type === 'learning' ? 'learning' : 'coo-work'}?topic=${item.id}`}
            className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs font-semibold">{postCount} bài viết</span>
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 text-gray-400 dark:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs">Chưa có bài viết</span>
          </span>
        )}

        {hasTarget && (
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">
              {new Date(item.targetDate!).toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
