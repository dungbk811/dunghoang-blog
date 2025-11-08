'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAdminLanguage } from '@/contexts/AdminLanguageContext';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category?: string;
  tags?: string[];
  hidden?: boolean;
}

interface BlogManagerProps {
  posts: BlogPost[];
  categories: string[];
  tags: string[];
}

export default function BlogManager({ posts, categories, tags }: BlogManagerProps) {
  const { t } = useAdminLanguage();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden' | 'scheduled'>('all');

  // Category management states
  const [renamingCategory, setRenamingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [createCategoryName, setCreateCategoryName] = useState('');

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'uncategorized' && !post.category) ||
        post.category === selectedCategory;

      const isScheduled = new Date(post.date) > new Date();
      const matchesVisibility =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'visible' && !post.hidden && !isScheduled) ||
        (visibilityFilter === 'hidden' && post.hidden) ||
        (visibilityFilter === 'scheduled' && isScheduled);

      return matchesSearch && matchesCategory && matchesVisibility;
    });
  }, [posts, searchQuery, selectedCategory, visibilityFilter]);

  // Stats
  const stats = {
    total: posts.length,
    visible: posts.filter((p) => !p.hidden && new Date(p.date) <= new Date()).length,
    hidden: posts.filter((p) => p.hidden).length,
    scheduled: posts.filter((p) => new Date(p.date) > new Date()).length,
  };

  // Category stats
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; visible: number; hidden: number }> = {};

    categories.forEach((cat) => {
      stats[cat] = { total: 0, visible: 0, hidden: 0 };
    });

    stats['uncategorized'] = { total: 0, visible: 0, hidden: 0 };

    posts.forEach((post) => {
      const cat = post.category || 'uncategorized';
      if (!stats[cat]) {
        stats[cat] = { total: 0, visible: 0, hidden: 0 };
      }
      stats[cat].total++;
      if (post.hidden) {
        stats[cat].hidden++;
      } else {
        stats[cat].visible++;
      }
    });

    return stats;
  }, [posts, categories]);

  const handleCreateCategory = async () => {
    if (!createCategoryName.trim()) return;

    const loadingToast = toast.loading(t.common.saving);

    try {
      const response = await fetch('/api/admin/blog-categories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: createCategoryName.trim() }),
      });

      if (!response.ok) throw new Error('Failed to create category');

      toast.success('Category created successfully!', { id: loadingToast });
      setShowCreateCategoryModal(false);
      setCreateCategoryName('');
      router.refresh();
    } catch (error) {
      console.error('Create category error:', error);
      toast.error(t.toast.addFailed, { id: loadingToast });
    }
  };

  const handleRenameCategory = async () => {
    if (!selectedCategory || selectedCategory === 'all' || !newCategoryName.trim()) return;

    const loadingToast = toast.loading(t.category.renaming);

    try {
      const response = await fetch('/api/admin/blog-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldName: selectedCategory,
          newName: newCategoryName.trim(),
        }),
      });

      if (!response.ok) throw new Error('Failed to rename');

      toast.success(t.toast.categoryRenamed, { id: loadingToast });
      setRenamingCategory(null);
      setNewCategoryName('');
      setSelectedCategory(newCategoryName.trim());
      router.refresh();
    } catch (error) {
      console.error('Rename error:', error);
      toast.error(t.toast.updateFailed, { id: loadingToast });
    }
  };

  const handleDeleteCategory = async () => {
    if (selectedCategory === 'all') return;

    const postCount = categoryStats[selectedCategory]?.total || 0;

    const confirmMessage = t.category.deleteConfirm
      .replace('{name}', selectedCategory)
      .replace('{count}', postCount.toString()) + '\n\n' + t.category.deleteAction;

    if (!confirm(confirmMessage)) return;

    // true = OK (delete posts), false = Cancel (move to uncategorized)
    const shouldDelete = window.confirm(
      `${t.category.deleteTopics}\n\nOK = ${t.category.deleteTopics}\n${t.common.cancel} = ${t.category.moveToUncategorized}`
    );

    const action = shouldDelete ? 'delete' : 'uncategorize';
    const loadingToast = toast.loading(t.common.loading);

    try {
      const response = await fetch(`/api/admin/blog-categories?category=${encodeURIComponent(selectedCategory)}&action=${action}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast.success(t.toast.categoryDeleted, { id: loadingToast });
      setRenamingCategory(null);
      setSelectedCategory('all');
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(t.toast.deleteFailed, { id: loadingToast });
    }
  };

  const handleToggleVisibility = async (post: BlogPost) => {
    const newHiddenState = !post.hidden;
    const loadingToast = toast.loading(t.common.saving);

    try {
      const response = await fetch('/api/admin/blog-posts/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: post.slug,
          updates: { hidden: newHiddenState },
        }),
      });

      if (!response.ok) throw new Error('Failed to update');

      const data = await response.json();

      // Show different messages based on whether rebuild is required
      if (data.requiresRebuild) {
        toast.success(
          'Updated! Changes will be live after deployment (~2-3 minutes)',
          { id: loadingToast, duration: 5000 }
        );
      } else {
        toast.success(t.toast.itemUpdated, { id: loadingToast });
        router.refresh();
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(t.toast.updateFailed, { id: loadingToast });
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(t.blog.deleteConfirm.replace('{slug}', slug))) return;

    const loadingToast = toast.loading(t.item.deleting);

    try {
      const response = await fetch(`/api/admin/blog-posts?slug=${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast.success(t.toast.itemDeleted, { id: loadingToast });
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(t.blog.deleteFailed, { id: loadingToast });
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t.blog.pageTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t.blog.pageDescription}
          </p>
        </div>
      </div>

      {/* Top Filter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <button
          onClick={() => setVisibilityFilter('all')}
          style={visibilityFilter === 'all' ? { borderColor: 'rgb(168 85 247)' } : {}}
          className={`rounded-lg p-6 border-2 transition-all hover:shadow-md relative focus:outline-none focus-visible:outline-none focus:ring-0 ${
            visibilityFilter === 'all'
              ? 'bg-purple-50 dark:bg-purple-900/20'
              : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
          }`}
        >
          {visibilityFilter === 'all' && (
            <div className="absolute top-3 right-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">{t.common.total}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </button>
        <button
          onClick={() => setVisibilityFilter('visible')}
          style={visibilityFilter === 'visible' ? { borderColor: 'rgb(22 163 74)' } : {}}
          className={`rounded-lg p-6 border-2 transition-all hover:shadow-md relative focus:outline-none focus-visible:outline-none focus:ring-0 ${
            visibilityFilter === 'visible'
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
          }`}
        >
          {visibilityFilter === 'visible' && (
            <div className="absolute top-3 right-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">{t.common.visible}</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.visible}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </button>
        <button
          onClick={() => setVisibilityFilter('hidden')}
          style={visibilityFilter === 'hidden' ? { borderColor: 'rgb(220 38 38)' } : {}}
          className={`rounded-lg p-6 border-2 transition-all hover:shadow-md relative focus:outline-none focus-visible:outline-none focus:ring-0 ${
            visibilityFilter === 'hidden'
              ? 'bg-red-50 dark:bg-red-900/20'
              : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
          }`}
        >
          {visibilityFilter === 'hidden' && (
            <div className="absolute top-3 right-3">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">{t.common.hidden}</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.hidden}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </div>
          </div>
        </button>
        <button
          onClick={() => setVisibilityFilter('scheduled')}
          style={visibilityFilter === 'scheduled' ? { borderColor: 'rgb(59 130 246)' } : {}}
          className={`rounded-lg p-6 border-2 transition-all hover:shadow-md relative focus:outline-none focus-visible:outline-none focus:ring-0 ${
            visibilityFilter === 'scheduled'
              ? 'bg-blue-50 dark:bg-blue-900/20'
              : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
          }`}
        >
          {visibilityFilter === 'scheduled' && (
            <div className="absolute top-3 right-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Scheduled</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.scheduled}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex gap-8">
        {/* Left Sidebar - Categories */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 sticky top-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                {t.blog.categories}
              </h3>
              <button
                onClick={() => setShowCreateCategoryModal(true)}
                className="p-1 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                title="Create new category"
              >
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex-1 text-left">{t.common.all}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-purple-700 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {stats.total}
                </span>
              </button>
              {categories.map((category) => {
                const catStats = categoryStats[category] || { total: 0, visible: 0, hidden: 0 };
                if (catStats.total === 0) return null;

                const isRenaming = renamingCategory === category;

                return (
                  <div key={category}>
                    {isRenaming ? (
                      // Rename Input
                      <div className="flex items-center gap-1 px-2 py-1">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameCategory();
                            if (e.key === 'Escape') {
                              setRenamingCategory(null);
                              setNewCategoryName('');
                            }
                          }}
                          placeholder={t.category.enterNewName}
                          className="flex-1 px-2 py-1 text-sm rounded border border-purple-500 dark:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          autoFocus
                        />
                        <button
                          onClick={handleRenameCategory}
                          className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setRenamingCategory(null);
                            setNewCategoryName('');
                          }}
                          className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      // Category Button
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                          selectedCategory === category
                            ? 'bg-purple-600 text-white'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="flex-1 text-left">{category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                          selectedCategory === category
                            ? 'bg-purple-700 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}>
                          {catStats.total}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Uncategorized */}
              {categoryStats['uncategorized']?.total > 0 && (
                <button
                  onClick={() => setSelectedCategory('uncategorized')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    selectedCategory === 'uncategorized'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex-1 text-left italic">{t.category.uncategorized}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    selectedCategory === 'uncategorized'
                      ? 'bg-purple-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {categoryStats['uncategorized'].total}
                  </span>
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <div className="flex-1 min-w-0">
          {/* Add New Button and Search Bar */}
          <div className="mb-6 flex items-center gap-4">
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t.blog.createNew}
            </Link>
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.blog.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Category Management Toolbar */}
          {selectedCategory !== 'all' && selectedCategory !== 'uncategorized' && (
            <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                  {t.category.managing} <span className="font-bold">{selectedCategory}</span>
                </h4>
              </div>

              {renamingCategory === selectedCategory ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder={t.category.newName}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameCategory();
                      if (e.key === 'Escape') {
                        setRenamingCategory(null);
                        setNewCategoryName('');
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleRenameCategory}
                    className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {t.common.save}
                  </button>
                  <button
                    onClick={() => {
                      setRenamingCategory(null);
                      setNewCategoryName('');
                    }}
                    className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {t.common.cancel}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setRenamingCategory(selectedCategory);
                      setNewCategoryName(selectedCategory);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {t.category.rename}
                  </button>
                  <button
                    onClick={handleDeleteCategory}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {t.category.delete}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">{t.blog.noPosts}</p>
              <Link
                href="/admin/blog/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t.blog.createFirstPost}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.slug}
                  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-purple-500 dark:hover:border-purple-500 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                          {post.title}
                        </h3>
                        {post.category && (
                          <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                            {post.category}
                          </span>
                        )}
                        {post.hidden && (
                          <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {t.common.hidden}
                          </span>
                        )}
                        {new Date(post.date) > new Date() && (
                          <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            📅 Scheduled
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {post.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                        <span>📅 {new Date(post.date).toLocaleDateString('vi-VN')}</span>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span key={tag}>#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex gap-2">
                      <button
                        onClick={() => handleToggleVisibility(post)}
                        className={`p-2 rounded-lg transition-all ${
                          post.hidden
                            ? 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
                        }`}
                        title={post.hidden ? t.item.showItem : t.item.hideItem}
                      >
                        {post.hidden ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {t.blog.view}
                      </Link>
                      <Link
                        href={`/admin/blog/edit/${post.slug}`}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                      >
                        {t.blog.edit}
                      </Link>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      >
                        {t.common.delete}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Category Modal */}
      {showCreateCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateCategoryModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t.blog.createCategory}
            </h3>
            <input
              type="text"
              value={createCategoryName}
              onChange={(e) => setCreateCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateCategory();
                if (e.key === 'Escape') setShowCreateCategoryModal(false);
              }}
              placeholder={t.blog.enterCategoryName}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateCategoryModal(false);
                  setCreateCategoryName('');
                }}
                className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleCreateCategory}
                disabled={!createCategoryName.trim()}
                className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.common.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
