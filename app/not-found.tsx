'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-slate-900 dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
            {t.notFound.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            {t.notFound.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t.notFound.goHome}
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors font-medium"
          >
            {t.notFound.viewBlog}
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {t.notFound.popularPages}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/learning"
              className="px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              {t.nav.learning}
            </Link>
            <Link
              href="/coo"
              className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              {t.coo.title}
            </Link>
            <Link
              href="/contact"
              className="px-3 py-1.5 text-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
            >
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
