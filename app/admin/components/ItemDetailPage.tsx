'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { learningRoadmap, cooRoadmap, type RoadmapItem, type WorkRole } from '@/lib/roadmap';
import EditItemModal from './EditItemModal';
import TopicContentEditor from './TopicContentEditor';
import Link from 'next/link';
import { useAdminLanguage } from '@/contexts/AdminLanguageContext';
import toast from 'react-hot-toast';

interface ItemDetailPageProps {
  id: string;
  type: 'learning' | 'coo';
  role?: WorkRole;
}

export default function ItemDetailPage({ id, type, role }: ItemDetailPageProps) {
  const router = useRouter();
  const { t } = useAdminLanguage();

  const [item, setItem] = useState<RoadmapItem | null>(null);
  const [editingInfo, setEditingInfo] = useState(false);
  const [editingContent, setEditingContent] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const roadmap = type === 'learning' ? learningRoadmap : cooRoadmap;
    let foundItem = roadmap.find(i => i.id === id);

    // Filter by role if specified
    if (foundItem && role && foundItem.role !== role) {
      foundItem = undefined;
    }

    if (foundItem) {
      setItem(foundItem);
    }
  }, [id, type, role]);

  // Fetch related blog posts
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        setLoadingPosts(true);
        const response = await fetch(`/api/admin/blog-posts?topic=${id}`);
        if (response.ok) {
          const data = await response.json();
          // API returns array or object, ensure we always have an array
          setRelatedPosts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching related posts:', error);
        setRelatedPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchRelatedPosts();
  }, [id]);

  const handleSaveItem = async (itemIdOrData: string | Partial<RoadmapItem>, updates?: Partial<RoadmapItem>) => {
    // EditItemModal can be in edit mode (itemIdOrData is string) or add mode (itemIdOrData is Partial<RoadmapItem>)
    const actualItemId = typeof itemIdOrData === 'string' ? itemIdOrData : id;
    const actualUpdates = typeof itemIdOrData === 'string' ? updates : itemIdOrData;

    const response = await fetch('/api/admin/roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId: actualItemId, type, updates: actualUpdates }),
    });

    if (!response.ok) {
      throw new Error('Failed to update item');
    }

    // Update local state immediately
    if (item && actualUpdates) {
      setItem({ ...item, ...actualUpdates });
    }

    router.refresh();
    setEditingInfo(false);
  };

  const handleSaveContent = async () => {
    // TopicContentEditor handles its own save internally
    setEditingContent(false);

    // Force reload to get updated data from roadmap.ts
    window.location.reload();
  };

  const handleToggleVisibility = async () => {
    if (!item) return;

    setIsTogglingVisibility(true);
    const newHiddenState = !item.hidden;
    const loadingToast = toast.loading(t.common.saving);

    try {
      const response = await fetch('/api/admin/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, type, updates: { hidden: newHiddenState } }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle visibility');
      }

      // Update local state immediately
      setItem({ ...item, hidden: newHiddenState });

      toast.success(t.toast.itemUpdated, { id: loadingToast });
      router.refresh();
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      toast.error(t.toast.updateFailed, { id: loadingToast });
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    if (!confirm(t.item.deleteConfirm)) return;

    setIsDeleting(true);
    const loadingToast = toast.loading(t.item.deleting);

    try {
      const response = await fetch(`/api/admin/roadmap?itemId=${item.id}&type=${type}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      toast.success(t.toast.itemDeleted, { id: loadingToast });
      router.push(getBackPath());
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error(t.toast.deleteFailed, { id: loadingToast });
      setIsDeleting(false);
    }
  };

  const getBackPath = () => {
    if (type === 'learning') return '/admin/learning';
    if (role) return `/admin/${role.toLowerCase()}-work`;
    return '/admin/coo-work';
  };

  const getPublicPath = () => {
    if (type === 'learning') return `/learning/${id}`;
    return `/work-item/${id}`;
  };

  if (!item) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Item not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(getBackPath())}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {item.category} {item.subcategory && `→ ${item.subcategory}`}
                  {item.role && ` • ${item.role}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingInfo(true)}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t.item.editInfo}
              </button>
              <button
                onClick={handleToggleVisibility}
                disabled={isTogglingVisibility}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  item.hidden
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-slate-600 text-white hover:bg-slate-700'
                }`}
              >
                {isTogglingVisibility ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {item.hidden ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    )}
                  </svg>
                )}
                {item.hidden ? t.item.showItem : t.item.hideItem}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                {t.item.delete}
              </button>
              <Link
                href={getPublicPath()}
                target="_blank"
                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h2>
                <button
                  onClick={() => setEditingContent(true)}
                  className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t.item.editContent}
                </button>
              </div>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{item.description}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : item.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {item.status}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Level</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                        item.level === 'beginner'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : item.level === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : item.level === 'advanced'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        {item.level}
                      </span>
                    </dd>
                  </div>
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</dt>
                    <dd className="mt-1 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {item.notes && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</dt>
                    <dd className="mt-1 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{item.notes}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Related Blog Posts Card */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Related Posts</h2>
                <Link
                  href={`/admin/blog/new?topic=${item.id}`}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  + New Post
                </Link>
              </div>
              {loadingPosts ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
                </div>
              ) : relatedPosts.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  No posts yet. Create your first post for this topic!
                </p>
              ) : (
                <div className="space-y-3">
                  {relatedPosts.map((post: any) => (
                    <Link
                      key={post.slug}
                      href={`/admin/blog/edit/${post.slug}`}
                      className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white line-clamp-2 flex-1">
                          {post.title}
                        </h3>
                        {post.hidden && (
                          <span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex-shrink-0">
                            Hidden
                          </span>
                        )}
                      </div>
                      {post.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                          {post.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(post.date).toLocaleDateString('vi-VN')}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Meta Info Card */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Meta Information</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Item ID</dt>
                  <dd className="mt-1 font-mono text-gray-900 dark:text-gray-100">{item.id}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Visibility</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                      item.hidden
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {item.hidden ? 'Hidden' : 'Visible'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Blog Posts</dt>
                  <dd className="mt-1">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400">
                      {loadingPosts ? '...' : relatedPosts.length} {relatedPosts.length === 1 ? 'post' : 'posts'}
                    </span>
                  </dd>
                </div>
                {item.startDate && (
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Start Date</dt>
                    <dd className="mt-1 text-gray-900 dark:text-gray-100">{item.startDate}</dd>
                  </div>
                )}
                {item.targetDate && (
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Target Date</dt>
                    <dd className="mt-1 text-gray-900 dark:text-gray-100">{item.targetDate}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {editingInfo && item && (
        <EditItemModal
          item={item}
          type={type}
          onClose={() => setEditingInfo(false)}
          onSave={handleSaveItem}
        />
      )}

      {editingContent && item && (
        <TopicContentEditor
          item={item}
          onClose={() => setEditingContent(false)}
          onSave={handleSaveContent}
        />
      )}
    </div>
  );
}
