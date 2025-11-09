'use client';

import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import RelatedCategories from '@/components/RelatedCategories';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { useI18n } from '@/lib/i18n';
import type { RoadmapItem } from '@/lib/roadmap';
import { cooRoadmap } from '@/lib/roadmap';

interface TopicDetailClientProps {
  topic: RoadmapItem;
  topicContent: { content: string } | null;
  topicPosts: Array<{
    slug: string;
    title: string;
    description: string;
    date: string;
    tags?: string[];
  }>;
}

export default function TopicDetailClient({ topic, topicContent, topicPosts }: TopicDetailClientProps) {
  const { t } = useI18n();

  // Get related COO Work items
  const relatedWorkItems = topic.relatedWorkIds
    ? cooRoadmap.filter(item => topic.relatedWorkIds?.includes(item.id))
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/learning"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              ← {t.topic.backToLearning}
            </Link>
          </div>

          {/* Title & Status */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {topic.title}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={topic.status} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {topic.category}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            {topic.description}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
            {topic.startDate && (
              <div>
                <span className="font-medium">{t.topic.start}:</span> {new Date(topic.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            )}
            {topic.targetDate && (
              <div>
                <span className="font-medium">{t.topic.target}:</span> {new Date(topic.targetDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>

          {/* Tags */}
          {topic.tags && topic.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {topic.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      {topicContent && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
            <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 dark:prose-strong:text-slate-100">
              <MDXRemote source={topicContent.content} />
            </article>
          </div>
        </section>
      )}

      {/* Posts Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header with Gradient Background */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-t-xl p-6 border border-gray-200 dark:border-gray-800 border-b-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t.topic.relatedPosts}
              </h2>
            </div>
            {topicPosts.length > 0 && (
              <div className="px-4 py-2 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white font-bold text-lg">
                {topicPosts.length}
              </div>
            )}
          </div>
          {topicPosts.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Khám phá {topicPosts.length} bài viết chi tiết về chủ đề này
            </p>
          )}
        </div>

        {topicPosts.length > 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-b-xl border border-gray-200 dark:border-gray-800 border-t-0 p-6">
            <div className="space-y-4">
              {topicPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block group"
                >
                  <article className="relative bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all">
                    {/* Post number badge */}
                    <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white font-bold flex items-center justify-center text-sm border-2 border-white dark:border-gray-900">
                      {index + 1}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                      <time dateTime={post.date} className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-1 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Read more arrow */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-b-xl border border-gray-200 dark:border-gray-800 border-t-0">
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                {t.topic.noPosts}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Bài viết sẽ được cập nhật sớm
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Related COO Work Section */}
      {relatedWorkItems.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-t-xl p-6 border border-gray-200 dark:border-gray-800 border-b-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-600 dark:bg-purple-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Related COO Work
                </h2>
              </div>
              <div className="px-4 py-2 rounded-full bg-purple-600 dark:bg-purple-500 text-white font-bold text-lg">
                {relatedWorkItems.length}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Các công việc COO liên quan đến chủ đề này
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-b-xl border border-gray-200 dark:border-gray-800 border-t-0 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedWorkItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/coo-work/${item.id}`}
                  className="block group"
                >
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <span>📁 {item.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.level === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        item.level === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                        item.level === 'advanced' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                      }`}>
                        {item.level === 'beginner' ? '🟢 Beginner' :
                         item.level === 'intermediate' ? '🟡 Intermediate' :
                         item.level === 'advanced' ? '🔴 Advanced' :
                         '💎 Expert'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Categories Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <RelatedCategories currentCategory={topic.category} type="learning" />
      </section>
    </div>
  );
}
