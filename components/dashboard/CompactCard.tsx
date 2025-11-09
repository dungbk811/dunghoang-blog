'use client';

import { useState } from 'react';
import { RoadmapItem } from '@/lib/roadmap';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';

interface CompactCardProps {
  item: RoadmapItem;
  postCount: number;
  type: 'learning' | 'coo';
}

export default function CompactCard({ item, postCount, type }: CompactCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-md">
      {/* Card Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={item.status} />
              {postCount > 0 && (
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  • 📝 {postCount} bài viết
                </span>
              )}
            </div>
          </div>

          {/* Expand Icon */}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-800">
          <div className="mt-3 space-y-3">
            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {item.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-500">
              {item.startDate && (
                <div>
                  <span className="font-medium">Bắt đầu:</span> {new Date(item.startDate).toLocaleDateString('vi-VN')}
                </div>
              )}
              {item.targetDate && (
                <div>
                  <span className="font-medium">Mục tiêu:</span> {new Date(item.targetDate).toLocaleDateString('vi-VN')}
                </div>
              )}
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* View Posts Link */}
            {postCount > 0 && (
              <Link
                href={`/blog?topic=${item.id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                Xem {postCount} bài viết
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
