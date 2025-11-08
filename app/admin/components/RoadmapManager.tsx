'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { learningRoadmap, cooRoadmap, type RoadmapItem, type SkillLevel } from '@/lib/roadmap';
import EditItemModal from './EditItemModal';
import TopicContentEditor from './TopicContentEditor';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAdminLanguage } from '@/contexts/AdminLanguageContext';
import { handleApiResponse } from '@/lib/admin-helpers';

type RoadmapType = 'learning' | 'coo';
type FilterStatus = 'all' | 'planned' | 'in-progress' | 'completed';

interface RoadmapManagerProps {
  type: RoadmapType;
}

export default function RoadmapManager({ type }: RoadmapManagerProps) {
  const router = useRouter();
  const { t } = useAdminLanguage();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const [addingNewItem, setAddingNewItem] = useState(false);
  const [editingContent, setEditingContent] = useState<RoadmapItem | null>(null);
  const [postCounts, setPostCounts] = useState<Record<string, number>>({});
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [optimisticHidden, setOptimisticHidden] = useState<Record<string, boolean>>({});
  const [editingCategoryName, setEditingCategoryName] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');
  const [expandedLevels, setExpandedLevels] = useState<Record<SkillLevel, boolean>>({
    beginner: true,
    intermediate: true,
    advanced: true,
    expert: true,
  });
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | 'all'>('all');
  const itemsPerPage = 10;

  const toggleLevel = (level: SkillLevel) => {
    setExpandedLevels(prev => ({ ...prev, [level]: !prev[level] }));
  };

  const handleCategoryChangeWithLevel = (category: string, level?: SkillLevel) => {
    setFilterCategory(category);
    setSelectedLevel(level || 'all');
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setFilterCategory(category);
    setSelectedLevel('all');
    setCurrentPage(1);
  };

  // Fetch post counts for each topic
  useEffect(() => {
    const fetchPostCounts = async () => {
      try {
        const response = await fetch('/api/admin/blog-posts');
        const data = await response.json();

        if (data.posts) {
          const counts: Record<string, number> = {};
          data.posts.forEach((post: any) => {
            if (post.topic) {
              counts[post.topic] = (counts[post.topic] || 0) + 1;
            }
          });
          setPostCounts(counts);
        }
      } catch (error) {
        console.error('Failed to fetch post counts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPostCounts();
  }, []);

  const handleSaveItem = async (itemId: string, updates: Partial<RoadmapItem>) => {
    const response = await fetch('/api/admin/roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, type, updates }),
    });

    if (!response.ok) {
      throw new Error('Failed to update item');
    }

    router.refresh();
  };

  const handleAddItem = async (newItem: Partial<RoadmapItem>) => {
    const loadingToast = toast.loading(t.common.saving);

    try {
      const response = await fetch('/api/admin/roadmap', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, item: newItem }),
      });

      await handleApiResponse(response, loadingToast, t.toast.itemAdded, router);
      setAddingNewItem(false);
    } catch (error) {
      console.error('Failed to add item:', error);
      toast.error(t.toast.addFailed, { id: loadingToast });
    }
  };

  // Unified handler for EditItemModal that supports both edit and add modes
  const handleSaveOrAddItem = async (itemIdOrData: string | Partial<RoadmapItem>, updates?: Partial<RoadmapItem>) => {
    if (typeof itemIdOrData === 'string') {
      // Edit mode: itemIdOrData is the item ID
      await handleSaveItem(itemIdOrData, updates!);
    } else {
      // Add mode: itemIdOrData is the new item data
      await handleAddItem(itemIdOrData);
    }
  };

  const handleDeleteItem = async (item: RoadmapItem) => {
    if (!confirm(t.item.deleteConfirm)) return;

    const loadingToast = toast.loading(t.item.deleting);

    try {
      const response = await fetch(`/api/admin/roadmap?itemId=${item.id}&type=${type}`, {
        method: 'DELETE',
      });

      await handleApiResponse(response, loadingToast, t.toast.itemDeleted, router);
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error(t.toast.deleteFailed, { id: loadingToast });
    }
  };

  const handleToggleVisibility = async (item: RoadmapItem) => {
    const currentHidden = optimisticHidden[item.id] ?? item.hidden;
    const newHiddenState = !currentHidden;

    // Optimistic update
    setOptimisticHidden(prev => ({ ...prev, [item.id]: newHiddenState }));
    setLoadingItems(prev => new Set([...prev, item.id]));

    const loadingToast = toast.loading(t.common.saving);

    try {
      const response = await fetch('/api/admin/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, type, updates: { hidden: newHiddenState } }),
      });

      await handleApiResponse(response, loadingToast, t.toast.itemUpdated);
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      // Revert optimistic update on error
      setOptimisticHidden(prev => ({ ...prev, [item.id]: currentHidden }));
      toast.error(t.toast.updateFailed, { id: loadingToast });
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (filterCategory === 'all') return;

    const itemsInCategory = allItems.filter(item => item.category === filterCategory);
    const confirmMessage = t.category.deleteConfirm
      .replace('{name}', filterCategory)
      .replace('{count}', itemsInCategory.length.toString());

    if (!confirm(confirmMessage)) return;

    const action = confirm(t.category.deleteAction);

    const loadingToast = toast.loading(t.common.loading);

    try {
      const response = await fetch('/api/admin/category', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: filterCategory,
          type,
          deleteTopics: action
        }),
      });

      await handleApiResponse(response, loadingToast, t.toast.categoryDeleted, router);
      setFilterCategory('all');
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error(t.toast.deleteFailed, { id: loadingToast });
    }
  };

  const handleRenameCategory = async () => {
    if (!newCategoryName.trim() || !editingCategoryName) return;

    const loadingToast = toast.loading(t.category.renaming);

    try {
      const response = await fetch('/api/admin/category', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldCategory: editingCategoryName,
          newCategory: newCategoryName.trim(),
          type
        }),
      });

      await handleApiResponse(response, loadingToast, t.toast.categoryRenamed, router);
      setFilterCategory(newCategoryName.trim());
      setEditingCategoryName(null);
      setNewCategoryName('');
    } catch (error) {
      console.error('Failed to rename category:', error);
      toast.error(t.toast.updateFailed, { id: loadingToast });
    }
  };

  const allItems = type === 'learning' ? learningRoadmap : cooRoadmap;
  const pageTitle = type === 'learning' ? t.learning.title : t.cooWork.title;
  const pageDescription = type === 'learning' ? t.learning.description : t.cooWork.description;

  // Get unique categories
  const categories = Array.from(new Set(allItems.map((item) => item.category)));

  // Group categories by level
  const levelGroups = {
    beginner: Array.from(new Set(allItems.filter(item => item.level === 'beginner').map(item => item.category))),
    intermediate: Array.from(new Set(allItems.filter(item => item.level === 'intermediate').map(item => item.category))),
    advanced: Array.from(new Set(allItems.filter(item => item.level === 'advanced').map(item => item.category))),
    expert: Array.from(new Set(allItems.filter(item => item.level === 'expert').map(item => item.category))),
  };

  // Calculate category counts based on visibility filter
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = allItems.filter(item => {
      const matchesCategory = item.category === category;
      const matchesVisibility =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'visible' && !item.hidden) ||
        (visibilityFilter === 'hidden' && item.hidden);
      return matchesCategory && matchesVisibility;
    }).length;
    return acc;
  }, {} as Record<string, number>);

  // Calculate level-specific category counts (category count at each level)
  const getLevelCategoryCount = (category: string, level: SkillLevel) => {
    return allItems.filter(item => {
      const matchesCategory = item.category === category;
      const matchesLevel = item.level === level;
      const matchesVisibility =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'visible' && !item.hidden) ||
        (visibilityFilter === 'hidden' && item.hidden);
      return matchesCategory && matchesLevel && matchesVisibility;
    }).length;
  };

  // Calculate level counts (count number of categories, not topics)
  const levelCounts = {
    beginner: Array.from(new Set(allItems.filter(item => {
      const matchesLevel = item.level === 'beginner';
      const matchesVisibility =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'visible' && !item.hidden) ||
        (visibilityFilter === 'hidden' && item.hidden);
      return matchesLevel && matchesVisibility;
    }).map(item => item.category))).length,
    intermediate: Array.from(new Set(allItems.filter(item => {
      const matchesLevel = item.level === 'intermediate';
      const matchesVisibility =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'visible' && !item.hidden) ||
        (visibilityFilter === 'hidden' && item.hidden);
      return matchesLevel && matchesVisibility;
    }).map(item => item.category))).length,
    advanced: Array.from(new Set(allItems.filter(item => {
      const matchesLevel = item.level === 'advanced';
      const matchesVisibility =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'visible' && !item.hidden) ||
        (visibilityFilter === 'hidden' && item.hidden);
      return matchesLevel && matchesVisibility;
    }).map(item => item.category))).length,
    expert: Array.from(new Set(allItems.filter(item => {
      const matchesLevel = item.level === 'expert';
      const matchesVisibility =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'visible' && !item.hidden) ||
        (visibilityFilter === 'hidden' && item.hidden);
      return matchesLevel && matchesVisibility;
    }).map(item => item.category))).length,
  };

  const filteredItems = allItems.filter((item) => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesLevel = selectedLevel === 'all' || item.level === selectedLevel;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Visibility filter
    const matchesVisibility =
      visibilityFilter === 'all' ||
      (visibilityFilter === 'visible' && !item.hidden) ||
      (visibilityFilter === 'hidden' && item.hidden);

    return matchesStatus && matchesCategory && matchesLevel && matchesSearch && matchesVisibility;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, searchQuery, visibilityFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const stats = {
    total: allItems.length,
    hidden: allItems.filter((i) => i.hidden).length,
    visible: allItems.filter((i) => !i.hidden).length,
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {pageTitle}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {pageDescription}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setVisibilityFilter('all')}
          className={`rounded-lg p-6 border-2 transition-all hover:shadow-md relative focus:outline-none ${
            visibilityFilter === 'all'
              ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-600 dark:border-purple-500'
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
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex gap-8">
        {/* Left Sidebar - Categories by Level */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 sticky top-8">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">
              {type === 'learning' ? t.learning.categories : t.cooWork.categories}
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterCategory === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex-1 text-left">{t.common.all}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  filterCategory === 'all'
                    ? 'bg-purple-700 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {allItems.filter(item => {
                    const matchesVisibility =
                      visibilityFilter === 'all' ||
                      (visibilityFilter === 'visible' && !item.hidden) ||
                      (visibilityFilter === 'hidden' && item.hidden);
                    return matchesVisibility;
                  }).length}
                </span>
              </button>

              {/* Beginner Level - Always show */}
              <div className="mt-3">
                <button
                  onClick={() => toggleLevel('beginner')}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <svg className={`w-3.5 h-3.5 transition-transform ${expandedLevels.beginner ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-xs uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400">Level 1: Beginner</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {levelCounts.beginner}
                  </span>
                </button>
                {expandedLevels.beginner && (
                  <div className="mt-1 space-y-0.5">
                    {levelGroups.beginner.length > 0 ? (
                      levelGroups.beginner.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryChangeWithLevel(category, 'beginner')}
                          className={`w-full flex items-center justify-between px-3 py-2 ml-6 rounded-lg text-sm transition-all ${
                            filterCategory === category && selectedLevel === 'beginner'
                              ? 'bg-purple-600 text-white font-medium'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex-1 text-left truncate">{category}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                            filterCategory === category && selectedLevel === 'beginner'
                              ? 'bg-purple-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>
                            {getLevelCategoryCount(category, 'beginner')}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="ml-6 px-3 py-2 text-xs text-slate-400 dark:text-slate-500 italic">No topics yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Intermediate Level - Always show */}
              <div className="mt-2">
                <button
                  onClick={() => toggleLevel('intermediate')}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <svg className={`w-3.5 h-3.5 transition-transform ${expandedLevels.intermediate ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-xs uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400">Level 2: Intermediate</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {levelCounts.intermediate}
                  </span>
                </button>
                {expandedLevels.intermediate && (
                  <div className="mt-1 space-y-0.5">
                    {levelGroups.intermediate.length > 0 ? (
                      levelGroups.intermediate.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryChangeWithLevel(category, 'intermediate')}
                          className={`w-full flex items-center justify-between px-3 py-2 ml-6 rounded-lg text-sm transition-all ${
                            filterCategory === category && selectedLevel === 'intermediate'
                              ? 'bg-purple-600 text-white font-medium'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex-1 text-left truncate">{category}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                            filterCategory === category && selectedLevel === 'intermediate'
                              ? 'bg-purple-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>
                            {getLevelCategoryCount(category, 'intermediate')}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="ml-6 px-3 py-2 text-xs text-slate-400 dark:text-slate-500 italic">No topics yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Advanced Level - Always show */}
              <div className="mt-2">
                <button
                  onClick={() => toggleLevel('advanced')}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <svg className={`w-3.5 h-3.5 transition-transform ${expandedLevels.advanced ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-xs uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400">Level 3: Advanced</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {levelCounts.advanced}
                  </span>
                </button>
                {expandedLevels.advanced && (
                  <div className="mt-1 space-y-0.5">
                    {levelGroups.advanced.length > 0 ? (
                      levelGroups.advanced.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryChangeWithLevel(category, 'advanced')}
                          className={`w-full flex items-center justify-between px-3 py-2 ml-6 rounded-lg text-sm transition-all ${
                            filterCategory === category && selectedLevel === 'advanced'
                              ? 'bg-purple-600 text-white font-medium'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex-1 text-left truncate">{category}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                            filterCategory === category && selectedLevel === 'advanced'
                              ? 'bg-purple-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>
                            {getLevelCategoryCount(category, 'advanced')}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="ml-6 px-3 py-2 text-xs text-slate-400 dark:text-slate-500 italic">No topics yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Expert Level - Always show */}
              <div className="mt-2">
                <button
                  onClick={() => toggleLevel('expert')}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <svg className={`w-3.5 h-3.5 transition-transform ${expandedLevels.expert ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-xs uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400">Level 4: Expert</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {levelCounts.expert}
                  </span>
                </button>
                {expandedLevels.expert && (
                  <div className="mt-1 space-y-0.5">
                    {levelGroups.expert.length > 0 ? (
                      levelGroups.expert.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryChangeWithLevel(category, 'expert')}
                          className={`w-full flex items-center justify-between px-3 py-2 ml-6 rounded-lg text-sm transition-all ${
                            filterCategory === category && selectedLevel === 'expert'
                              ? 'bg-purple-600 text-white font-medium'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex-1 text-left truncate">{category}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                            filterCategory === category && selectedLevel === 'expert'
                              ? 'bg-purple-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>
                            {getLevelCategoryCount(category, 'expert')}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="ml-6 px-3 py-2 text-xs text-slate-400 dark:text-slate-500 italic">No topics yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <div className="flex-1 min-w-0">
          {/* Add New Button and Search Bar */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => setAddingNewItem(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t.item.addNew}
            </button>
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={type === 'learning' ? t.learning.searchPlaceholder : t.cooWork.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Category Management Toolbar */}
          {filterCategory !== 'all' && (
            <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                  {t.category.managing} <span className="font-bold">{filterCategory}</span>
                </h4>
              </div>

              {editingCategoryName === filterCategory ? (
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
                        setEditingCategoryName(null);
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
                      setEditingCategoryName(null);
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
                      setEditingCategoryName(filterCategory);
                      setNewCategoryName(filterCategory);
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

          {/* Items Grid */}
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">{t.item.noResults}</p>
              </div>
            ) : (
              paginatedItems.map((item) => {
                const isHidden = optimisticHidden[item.id] ?? item.hidden;
                return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                          {isHidden && (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                              {t.common.hidden}
                            </span>
                          )}
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${
                              item.level === 'beginner'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : item.level === 'intermediate'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : item.level === 'advanced'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                            }`}
                          >
                            {item.level === 'beginner' ? '🟢 Beginner' : item.level === 'intermediate' ? '🟡 Intermediate' : item.level === 'advanced' ? '🔴 Advanced' : '💎 Expert'}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              item.status === 'completed'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : item.status === 'in-progress'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}
                          >
                            {item.status === 'completed' ? t.status.completed : item.status === 'in-progress' ? t.status.inProgress : t.status.planned}
                          </span>
                          {item.priority && (
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              item.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              item.priority === 'medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                              {item.priority === 'high' ? t.priority.high : item.priority === 'medium' ? t.priority.medium : t.priority.low}
                            </span>
                          )}
                          {!loadingPosts && postCounts[item.id] && (
                            <Link
                              href={`/admin/blog?topic=${item.id}`}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-xs font-semibold">{postCounts[item.id]} {t.item.posts}</span>
                            </Link>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                          <span>📁 {item.category}</span>
                          {item.subcategory && <span>→ {item.subcategory}</span>}
                        </div>

                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex gap-2">
                        {/* Edit Info */}
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all"
                          title={t.item.editInfo}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Edit Content */}
                        <button
                          onClick={() => setEditingContent(item)}
                          className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all"
                          title={t.item.editContent}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>

                        {/* Toggle Visibility */}
                        <button
                          onClick={() => handleToggleVisibility(item)}
                          disabled={loadingItems.has(item.id)}
                          className={`p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            isHidden
                              ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                          title={isHidden ? t.item.showItem : t.item.hideItem}
                        >
                          {loadingItems.has(item.id) ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {isHidden ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              )}
                            </svg>
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteItem(item)}
                          className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                          title={t.item.delete}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>

                        {/* New Post */}
                        <Link
                          href={`/admin/blog/new?topic=${item.id}`}
                          className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all"
                          title={t.item.createPost}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {filteredItems.length > itemsPerPage && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t.pagination.showing
                  .replace('{start}', (startIndex + 1).toString())
                  .replace('{end}', Math.min(endIndex, filteredItems.length).toString())
                  .replace('{total}', filteredItems.length.toString())}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t.pagination.previous}
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = page === 1 ||
                                     page === totalPages ||
                                     (page >= currentPage - 1 && page <= currentPage + 1);

                    const showEllipsis = (page === 2 && currentPage > 3) ||
                                         (page === totalPages - 1 && currentPage < totalPages - 2);

                    if (!showPage && !showEllipsis) return null;

                    if (showEllipsis) {
                      return (
                        <span key={page} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[40px] px-3 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-purple-600 text-white font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t.pagination.next}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          type={type}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveOrAddItem}
        />
      )}

      {/* Add New Item Modal */}
      {addingNewItem && (
        <EditItemModal
          item={null}
          type={type}
          onClose={() => setAddingNewItem(false)}
          onSave={handleSaveOrAddItem}
        />
      )}

      {/* Topic Content Editor */}
      {editingContent && (
        <TopicContentEditor
          item={editingContent}
          onClose={() => setEditingContent(null)}
          onSave={() => {
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
