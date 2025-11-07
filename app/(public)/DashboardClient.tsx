'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';

interface DashboardClientProps {
  learningStats: { total: number; completed: number };
  cooStats: { total: number; completed: number };
  postsCount: number;
}

export default function DashboardClient({ learningStats, cooStats, postsCount }: DashboardClientProps) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section - Clean & Professional */}
      <section className="relative border-b border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzMzZWEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djEwSDI2VjM0aDEwem0wLTM0djEwSDI2VjBoMTB6TTAgMzR2MTBoMTBWMzRIMHptMC0zNHYxMGgxMFYwSDB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                {t.dashboard.heroTitle}
              </h1>

              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                {t.dashboard.heroDescription}
              </p>

              {/* Achievement Badges */}
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.dashboard.badges.iso9001}
                </div>
                <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.dashboard.badges.iso27001}
                </div>
                <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.dashboard.badges.cmmi}
                </div>
              </div>
            </div>

            {/* Right side - Visual Illustration */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Main card showing learning + COO work */}
                <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                  {/* Learning Section (Purple) */}
                  <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-purple-300/60 dark:bg-purple-700/60 rounded-full w-24 mb-1"></div>
                        <div className="h-2 bg-purple-200/40 dark:bg-purple-800/40 rounded-full w-16"></div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-1.5 bg-purple-200/50 dark:bg-purple-900/50 rounded-full w-full"></div>
                      <div className="h-1.5 bg-purple-200/50 dark:bg-purple-900/50 rounded-full w-4/5"></div>
                    </div>
                  </div>

                  {/* COO Work Section (Blue) */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-blue-300/60 dark:bg-blue-700/60 rounded-full w-28 mb-1"></div>
                        <div className="h-2 bg-blue-200/40 dark:bg-blue-800/40 rounded-full w-20"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-12 bg-blue-200/50 dark:bg-blue-900/50 rounded-lg"></div>
                      <div className="h-12 bg-blue-200/50 dark:bg-blue-900/50 rounded-lg"></div>
                      <div className="h-12 bg-blue-200/50 dark:bg-blue-900/50 rounded-lg"></div>
                    </div>
                  </div>

                  {/* Stats badges */}
                  <div className="flex gap-2 mt-6">
                    <div className="flex-1 px-2 py-1.5 bg-green-100 dark:bg-green-900/30 rounded text-xs text-center text-green-700 dark:text-green-400 font-medium">
                      ISO 9001
                    </div>
                    <div className="flex-1 px-2 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-center text-blue-700 dark:text-blue-400 font-medium">
                      ISO 27001
                    </div>
                    <div className="flex-1 px-2 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded text-xs text-center text-purple-700 dark:text-purple-400 font-medium">
                      CMMI L3
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Content Sections */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Learning Section */}
          <div className="mb-12">
            <Link href="/learning" className="group block border-l-4 border-purple-500 pl-6 py-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors rounded-r-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg shrink-0">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">{t.nav.learning}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {t.dashboard.sections.learningTitle}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {t.dashboard.sections.learningDescription}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span>{learningStats.total} {t.dashboard.sections.topics}</span>
                    <span>•</span>
                    <span>{learningStats.completed} {t.dashboard.sections.completed}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* COO Work Section */}
          <div className="mb-12">
            <Link href="/coo-work" className="group block border-l-4 border-blue-500 pl-6 py-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors rounded-r-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t.nav.coo}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t.dashboard.sections.cooTitle}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {t.dashboard.sections.cooDescription}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span>{cooStats.total} {t.dashboard.sections.tasks}</span>
                    <span>•</span>
                    <span>{cooStats.completed} {t.dashboard.sections.completed}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Blog Posts Section */}
          {postsCount > 0 && (
            <div>
              <Link href="/blog" className="group block border-l-4 border-emerald-500 pl-6 py-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors rounded-r-lg">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg shrink-0">
                    <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{t.nav.other}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {t.dashboard.sections.otherTitle}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {t.dashboard.sections.otherDescription}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span>{postsCount} {t.dashboard.sections.posts}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {postsCount === 0 && (
        <section className="py-20 text-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Coming soon...
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
