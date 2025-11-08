'use client';

import { useState, useMemo } from 'react';
import { RoadmapItem, RoadmapStatus, SkillLevel } from '@/lib/roadmap';
import SearchAndFilter from '@/components/dashboard/SearchAndFilter';
import TopicCard from '@/components/dashboard/TopicCard';
import RelatedCategories from '@/components/RelatedCategories';
import { useI18n } from '@/lib/i18n';

interface COOWorkClientProps {
  roadmapWithCounts: { item: RoadmapItem; postCount: number }[];
  stats: {
    total: number;
    planned: number;
    inProgress: number;
    completed: number;
  };
  isSearchOpen: boolean;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  renderHeader: () => React.ReactNode;
}

export default function COOWorkClient({
  roadmapWithCounts,
  stats,
  isSearchOpen,
  activeCategory,
  onCategoryChange,
  renderHeader
}: COOWorkClientProps) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<RoadmapStatus[]>([
    'planned',
    'in-progress',
    'completed',
  ]);
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'title'>('priority');
  const [itemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedLevels, setExpandedLevels] = useState<Record<SkillLevel, boolean>>({
    beginner: true,
    intermediate: true,
    advanced: true,
    expert: true,
  });
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | 'all'>('all');

  const toggleLevel = (level: SkillLevel) => {
    setExpandedLevels(prev => ({ ...prev, [level]: !prev[level] }));
  };

  const handleCategoryChangeWithLevel = (category: string, level?: SkillLevel) => {
    onCategoryChange(category);
    setSelectedLevel(level || 'all');
    setCurrentPage(1);
  };

  // Get all unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(roadmapWithCounts.map(({ item }) => item.category))).sort();
    return [t.common.all, ...cats];
  }, [roadmapWithCounts, t.common.all]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { [t.common.all]: roadmapWithCounts.length };
    roadmapWithCounts.forEach(({ item }) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [roadmapWithCounts, t.common.all]);

  // Group categories by level
  const levelGroups = useMemo(() => ({
    beginner: Array.from(new Set(roadmapWithCounts.filter(({ item }) => item.level === 'beginner').map(({ item }) => item.category))),
    intermediate: Array.from(new Set(roadmapWithCounts.filter(({ item }) => item.level === 'intermediate').map(({ item }) => item.category))),
    advanced: Array.from(new Set(roadmapWithCounts.filter(({ item }) => item.level === 'advanced').map(({ item }) => item.category))),
    expert: Array.from(new Set(roadmapWithCounts.filter(({ item }) => item.level === 'expert').map(({ item }) => item.category))),
  }), [roadmapWithCounts]);

  // Calculate level counts (count number of categories, not topics)
  const levelCounts = useMemo(() => ({
    beginner: levelGroups.beginner.length,
    intermediate: levelGroups.intermediate.length,
    advanced: levelGroups.advanced.length,
    expert: levelGroups.expert.length,
  }), [levelGroups]);

  // Calculate level-specific category counts (category count at each level)
  const getLevelCategoryCount = (category: string, level: SkillLevel) => {
    return roadmapWithCounts.filter(({ item }) => item.category === category && item.level === level).length;
  };

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = roadmapWithCounts;

    // Filter by category
    if (activeCategory !== t.common.all) {
      filtered = filtered.filter(({ item }) => item.category === activeCategory);
    }

    // Filter by level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(({ item }) => item.level === selectedLevel);
    }

    // Filter by status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(({ item }) => selectedStatuses.includes(item.status));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        ({ item }) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      // First, sort by status: completed > in-progress > planned
      const statusOrder = { 'completed': 0, 'in-progress': 1, 'planned': 2 };
      const aStatusOrder = statusOrder[a.item.status];
      const bStatusOrder = statusOrder[b.item.status];

      if (aStatusOrder !== bStatusOrder) {
        return aStatusOrder - bStatusOrder;
      }

      // Then apply secondary sort
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const aPriority = a.item.priority ? priorityOrder[a.item.priority] : 3;
        const bPriority = b.item.priority ? priorityOrder[b.item.priority] : 3;
        return aPriority - bPriority;
      } else if (sortBy === 'date') {
        const aDate = a.item.startDate ? new Date(a.item.startDate).getTime() : 0;
        const bDate = b.item.startDate ? new Date(b.item.startDate).getTime() : 0;
        return bDate - aDate;
      } else {
        return a.item.title.localeCompare(b.item.title);
      }
    });

    return sorted;
  }, [roadmapWithCounts, activeCategory, selectedLevel, selectedStatuses, searchQuery, sortBy, t.common.all]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusToggle = (status: RoadmapStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    onCategoryChange(category);
    setSelectedLevel('all');
    setCurrentPage(1);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-8">
        {renderHeader()}
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 mb-8">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {t.coo.allTasks}
        </button>
      </div>

      {/* Layout with Sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex gap-6">
          {/* Left Sidebar - Categories */}
          <aside className={`${
            isSidebarOpen ? 'block' : 'hidden'
          } lg:block fixed lg:sticky top-16 lg:top-24 left-0 w-64 lg:w-64 flex-shrink-0 h-[calc(100vh-4rem)] lg:h-auto bg-white dark:bg-slate-900 border-r lg:border-r-0 lg:border border-slate-200 dark:border-slate-800 lg:rounded-xl p-4 overflow-y-auto z-20`}>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
              {t.coo.allTasks}
            </h3>
            <nav className="space-y-1 mb-6">
              <button
                onClick={() => {
                  handleCategoryChange(t.common.all);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                  activeCategory === t.common.all
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex-1 text-left">{t.common.all}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  activeCategory === t.common.all
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {categoryCounts[t.common.all] || 0}
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
                    <span className="text-xs uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400">Level 1: {t.coo.levels.beginner}</span>
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
                          onClick={() => {
                            handleCategoryChangeWithLevel(category, 'beginner');
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 ml-6 rounded-lg text-sm transition-all ${
                            activeCategory === category && selectedLevel === 'beginner'
                              ? 'bg-blue-600 text-white font-medium'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex-1 text-left truncate">{category}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                            activeCategory === category && selectedLevel === 'beginner'
                              ? 'bg-blue-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>
                            {getLevelCategoryCount(category, 'beginner')}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="ml-6 px-3 py-2 text-xs text-slate-400 dark:text-slate-500 italic">{t.coo.noTopicsYet}</p>
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
                    <span className="text-xs uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400">Level 2: {t.coo.levels.intermediate}</span>
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
                          onClick={() => {
                            handleCategoryChangeWithLevel(category, 'intermediate');
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 ml-6 rounded-lg text-sm transition-all ${
                            activeCategory === category && selectedLevel === 'intermediate'
                              ? 'bg-blue-600 text-white font-medium'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex-1 text-left truncate">{category}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                            activeCategory === category && selectedLevel === 'intermediate'
                              ? 'bg-blue-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>
                            {getLevelCategoryCount(category, 'intermediate')}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="ml-6 px-3 py-2 text-xs text-slate-400 dark:text-slate-500 italic">{t.coo.noTopicsYet}</p>
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
                    <span className="text-xs uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400">Level 3: {t.coo.levels.advanced}</span>
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
                          onClick={() => {
                            handleCategoryChangeWithLevel(category, 'advanced');
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 ml-6 rounded-lg text-sm transition-all ${
                            activeCategory === category && selectedLevel === 'advanced'
                              ? 'bg-blue-600 text-white font-medium'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex-1 text-left truncate">{category}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                            activeCategory === category && selectedLevel === 'advanced'
                              ? 'bg-blue-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>
                            {getLevelCategoryCount(category, 'advanced')}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="ml-6 px-3 py-2 text-xs text-slate-400 dark:text-slate-500 italic">{t.coo.noTopicsYet}</p>
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
                    <span className="text-xs uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400">Level 4: {t.coo.levels.expert}</span>
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
                          onClick={() => {
                            handleCategoryChangeWithLevel(category, 'expert');
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 ml-6 rounded-lg text-sm transition-all ${
                            activeCategory === category && selectedLevel === 'expert'
                              ? 'bg-blue-600 text-white font-medium'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex-1 text-left truncate">{category}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                            activeCategory === category && selectedLevel === 'expert'
                              ? 'bg-blue-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>
                            {getLevelCategoryCount(category, 'expert')}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="ml-6 px-3 py-2 text-xs text-slate-400 dark:text-slate-500 italic">{t.coo.noTopicsYet}</p>
                    )}
                  </div>
                )}
              </div>
            </nav>

            {/* Status Filters */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
                {t.common.status}
              </h3>
              <div className="space-y-2">
                {[
                  { value: 'planned' as const, label: t.status.planned },
                  { value: 'in-progress' as const, label: t.status.inProgress },
                  { value: 'completed' as const, label: t.status.completed },
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusToggle(status.value)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                      selectedStatuses.includes(status.value)
                        ? 'bg-blue-50/50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-100'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      selectedStatuses.includes(status.value)
                        ? 'bg-blue-600/80 border-blue-600/80'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {selectedStatuses.includes(status.value) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span>{status.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-10"
            />
          )}

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Search & Sort */}
            {isSearchOpen && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={t.common.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2.5 pl-10 pr-10 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                    />
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setCurrentPage(1);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {t.common.sort}:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'priority' as const, label: t.sort.priority },
                        { value: 'date' as const, label: t.sort.date },
                        { value: 'title' as const, label: t.sort.title },
                      ].map((sort) => (
                        <button
                          key={sort.value}
                          onClick={() => {
                            setSortBy(sort.value);
                            setCurrentPage(1);
                          }}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                            sortBy === sort.value
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                          }`}
                        >
                          {sort.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-5 w-1 bg-purple-600 rounded-full"></div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {filteredAndSortedItems.length} {filteredAndSortedItems.length === 1 ? t.coo.task : t.coo.tasks}
                </h2>
              </div>
            </div>

      {/* Grid */}
      {filteredAndSortedItems.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {paginatedItems.map(({ item, postCount }) => (
              <TopicCard key={item.id} item={item} postCount={postCount} type="coo" />
            ))}
          </div>

          {/* Related Categories */}
          <RelatedCategories currentCategory={activeCategory} type="coo" />

          {/* Minimal Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t.pagination.previous}
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t.pagination.next}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-base font-medium text-slate-900 dark:text-white mb-1">
            {t.coo.noTasksFound}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.coo.adjustFilters}
          </p>
        </div>
      )}
          </div>
        </div>
      </div>
    </>
  );
}
