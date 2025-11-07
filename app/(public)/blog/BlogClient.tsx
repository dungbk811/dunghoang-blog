'use client';

import { useState } from 'react';
import PostCard from '@/components/PostCard';
import { useI18n } from '@/lib/i18n';
import type { PostMetadata } from '@/lib/posts';

interface BlogClientProps {
  posts: PostMetadata[];
  categories: string[];
  tags: string[];
}

export default function BlogClient({ posts, categories, tags }: BlogClientProps) {
  const { t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter posts based on selected category
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category === selectedCategory)
    : posts;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header Section */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t.blog.pageTitle}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            {t.blog.explorePrefix} {filteredPosts.length} {t.blog.exploreSuffix}
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t.blog.filterByCategory}
              </span>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {t.blog.all} ({posts.length})
              </button>
              {categories.map((category) => {
                const count = posts.filter((p) => p.category === category).length;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg italic">
              {t.blog.noPosts}
            </p>
          </div>
        )}
      </section>

      {/* Tags Cloud (Optional) */}
      {tags.length > 0 && (
        <section className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {t.blog.popularTags}
            </h2>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => {
                const count = posts.filter((p) => p.tags?.includes(tag)).length;
                return (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    #{tag} ({count})
                  </span>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
