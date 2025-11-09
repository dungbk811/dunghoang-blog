'use client';

import Link from 'next/link';
import { useAdminLanguage } from '@/contexts/AdminLanguageContext';
import { useUserProfile } from '@/contexts/PositionContext';

interface DashboardContentProps {
  learningStats: {
    total: number;
    planned: number;
    inProgress: number;
    completed: number;
  };
  cooStats: {
    total: number;
    planned: number;
    inProgress: number;
    completed: number;
  };
  postStats: {
    total: number;
    visible: number;
    hidden: number;
  };
}

export default function DashboardContent({ learningStats, cooStats, postStats }: DashboardContentProps) {
  const { t } = useAdminLanguage();
  const { profile } = useUserProfile();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t.dashboard.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.dashboard.description}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/learning" className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{learningStats.total}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t.dashboard.learningTopics}</h3>
          <div className="flex gap-3 text-xs">
            <span className="text-blue-600 dark:text-blue-400">{learningStats.planned} {t.dashboard.planned}</span>
            <span className="text-yellow-600 dark:text-yellow-400">{learningStats.inProgress} {t.dashboard.active}</span>
            <span className="text-green-600 dark:text-green-400">{learningStats.completed} {t.dashboard.done}</span>
          </div>
        </Link>

        <Link href="/admin/coo-work" className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{cooStats.total}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t.dashboard.cooTasks}</h3>
          <div className="flex gap-3 text-xs">
            <span className="text-blue-600 dark:text-blue-400">{cooStats.planned} {t.dashboard.planned}</span>
            <span className="text-yellow-600 dark:text-yellow-400">{cooStats.inProgress} {t.dashboard.active}</span>
            <span className="text-green-600 dark:text-green-400">{cooStats.completed} {t.dashboard.done}</span>
          </div>
        </Link>

        <Link href="/admin/blog" className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{postStats.total}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t.dashboard.blogPosts}</h3>
          <div className="flex gap-3 text-xs">
            <span className="text-green-600 dark:text-green-400">{postStats.visible} {t.common.visible}</span>
            <span className="text-gray-600 dark:text-gray-400">{postStats.hidden} {t.common.hidden}</span>
          </div>
        </Link>

        <Link href="/admin/contact" className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t.contact.title}</h3>
          <div className="text-xs space-y-1">
            <div className="text-purple-600 dark:text-purple-400 font-medium truncate">{profile.email}</div>
            <div className="text-gray-600 dark:text-gray-400">{profile.phone}</div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.dashboard.quickActions}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/learning" className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{t.dashboard.manageLearning}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.updateTopicsStatus}</div>
              </div>
            </div>
          </Link>
          <Link href="/admin/coo-work" className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-purple-500 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{t.dashboard.manageCooWork}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.updateTasksProgress}</div>
              </div>
            </div>
          </Link>
          <Link href="/admin/blog" className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{t.dashboard.manageBlog}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.createEditPosts}</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
