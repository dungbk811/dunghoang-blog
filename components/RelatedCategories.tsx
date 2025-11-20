import Link from 'next/link';
import { getRelatedCategories } from '@/lib/roadmapRelations';

interface RelatedCategoriesProps {
  currentCategory: string;
  type: 'learning' | 'coo';
}

export default function RelatedCategories({ currentCategory, type }: RelatedCategoriesProps) {
  // Don't show for "All" category
  if (currentCategory === 'All') {
    return null;
  }

  const relatedCategories = getRelatedCategories(currentCategory, type);
  const targetPath = type === 'learning' ? '/work' : '/learning';
  const title = type === 'learning'
    ? '📋 Áp dụng vào công việc'
    : '📚 Kiến thức cần học';

  // Show message when no related categories
  if (relatedCategories.length === 0) {
    const emptyMessage = type === 'learning'
      ? 'Chưa có công việc nào áp dụng kiến thức này'
      : 'Chưa có kiến thức liên quan nào';

    return (
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-800/30 rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
          {relatedCategories.reduce((sum, cat) => sum + cat.count, 0)} liên kết
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {relatedCategories.map(({ category, count }) => (
          <Link
            key={category}
            href={`${targetPath}?category=${encodeURIComponent(category)}`}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {category}
            </span>
            <span className="flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {count}
            </span>
            <svg
              className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
