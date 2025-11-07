import Link from 'next/link';
import { PostMetadata } from '@/lib/posts';
import { formatDateShort, calculateReadingTime } from '@/lib/utils';

interface PostCardProps {
  post: PostMetadata;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const readingTime = post.content ? calculateReadingTime(post.content) : 0;

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`}>
        <article className="group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg">
          {/* Cover Image */}
          {post.coverImage ? (
            <div className="relative h-64 overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              {post.category && (
                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-white/90 dark:bg-gray-900/90 text-blue-700 dark:text-blue-300 rounded-full backdrop-blur-sm">
                  {post.category}
                </span>
              )}
            </div>
          ) : (
            <div className="relative h-64 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 flex items-center justify-center">
              <svg className="w-20 h-20 text-indigo-300 dark:text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {post.category && (
                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-white/90 dark:bg-gray-900/90 text-blue-700 dark:text-blue-300 rounded-full backdrop-blur-sm">
                  {post.category}
                </span>
              )}
            </div>
          )}

          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.title}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg line-clamp-3">
              {post.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500 mb-4">
              <time className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDateShort(post.date)}
              </time>
              {readingTime > 0 && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                  {readingTime} phút đọc
                </span>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md">
        {/* Cover Image for regular post */}
        {post.coverImage ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {post.category && (
              <span className="absolute top-3 right-3 text-xs font-medium px-2 py-1 bg-white/90 dark:bg-gray-900/90 text-blue-700 dark:text-blue-300 rounded backdrop-blur-sm">
                {post.category}
              </span>
            )}
          </div>
        ) : (
          <div className="relative h-48 bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 dark:from-slate-800 dark:via-slate-850 dark:to-indigo-900/20 flex items-center justify-center">
            <svg className="w-16 h-16 text-slate-300 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {post.category && (
              <span className="absolute top-3 right-3 text-xs font-medium px-2 py-1 bg-white/90 dark:bg-gray-900/90 text-blue-700 dark:text-blue-300 rounded backdrop-blur-sm">
                {post.category}
              </span>
            )}
          </div>
        )}

        <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
            {post.title}
          </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {post.description}
        </p>

        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-500">
          <time>{formatDateShort(post.date)}</time>
          {readingTime > 0 && (
            <>
              <span>•</span>
              <span>{readingTime} phút đọc</span>
            </>
          )}
        </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
