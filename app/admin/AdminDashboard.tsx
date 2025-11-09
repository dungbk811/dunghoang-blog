'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { learningRoadmap, cooRoadmap, type RoadmapItem } from '@/lib/roadmap';
import { useUserProfile } from '@/contexts/PositionContext';
import EditItemModal from './EditItemModal';
import toast from 'react-hot-toast';

type TabType = 'learning' | 'coo';
type FilterStatus = 'all' | 'planned' | 'in-progress' | 'completed';

export default function AdminDashboard() {
  const router = useRouter();
  const { profile, updateProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<TabType>('learning');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'grouped'>('table');
  const itemsPerPage = 20;

  // Profile editing
  const [editName, setEditName] = useState(profile.name);
  const [editPosition, setEditPosition] = useState(profile.position);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  // Sync edit state with profile
  useEffect(() => {
    setEditName(profile.name);
    setEditPosition(profile.position);
  }, [profile.name, profile.position]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const handleSaveItem = async (itemId: string, updates: Partial<RoadmapItem>) => {
    const response = await fetch('/api/admin/roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, type: activeTab, updates }),
    });

    if (!response.ok) {
      throw new Error('Failed to update item');
    }

    // Refresh the page to show updated data
    router.refresh();
  };

  const allItems = activeTab === 'learning' ? learningRoadmap : cooRoadmap;

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(allItems.map((item) => item.category)))];

  const filteredItems = allItems.filter((item) => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (status: FilterStatus) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setFilterCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setFilterCategory('all');
    setCurrentPage(1);
  };

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, RoadmapItem[]>);

  const stats = {
    total: allItems.length,
    planned: allItems.filter((i) => i.status === 'planned').length,
    inProgress: allItems.filter((i) => i.status === 'in-progress').length,
    completed: allItems.filter((i) => i.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage roadmap & blog posts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                View Site →
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Planned</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.planned}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
          <button
            onClick={() => setShowProfileEdit(!showProfileEdit)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Profile Settings
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profile.name} • {profile.position}
                </p>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${showProfileEdit ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showProfileEdit && (
            <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-800 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Position Input */}
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    id="position"
                    value={editPosition}
                    onChange={(e) => setEditPosition(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="e.g., COO, CEO, CTO, Developer"
                  />
                </div>
              </div>

              {/* Quick Select Position Buttons */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick select position:</p>
                <div className="flex flex-wrap gap-2">
                  {['COO', 'CEO', 'CTO', 'Developer', 'Designer', 'Manager'].map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setEditPosition(pos)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        editPosition === pos
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    updateProfile({ name: editName, position: editPosition });
                    toast.success('Profile updated successfully!');
                    setShowProfileEdit(false);
                  }}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditName(profile.name);
                    setEditPosition(profile.position);
                    setShowProfileEdit(false);
                  }}
                  className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabs & Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('learning')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'learning'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                📚 Learning ({learningRoadmap.length})
              </button>
              <button
                onClick={() => setActiveTab('coo')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'coo'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                💼 COO Work ({cooRoadmap.length})
              </button>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search items..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value as FilterStatus)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="planned">Dự kiến</option>
              <option value="in-progress">Đang thực hiện</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>

          {/* Second row: Category filter and view mode */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Category Filter */}
            <div className="flex items-center gap-3 flex-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Category:
              </label>
              <select
                value={filterCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.filter(c => c !== 'all').map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                📋 Table
              </button>
              <button
                onClick={() => setViewMode('grouped')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'grouped'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                📂 Grouped
              </button>
            </div>
          </div>
          </div>
        </div>

        {/* Items List */}
        {viewMode === 'table' ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {item.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {item.category}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : item.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-800">
              {paginatedItems.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {item.category}
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
                        {item.status}
                      </span>
                    </div>
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium whitespace-nowrap"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No items found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Category Header */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {category}
                    </h3>
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                      {items.length} items
                    </span>
                  </div>
                </div>

                {/* Category Items */}
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {items.map((item) => (
                    <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                              {item.title}
                            </h4>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                                item.status === 'completed'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : item.status === 'in-progress'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}
                            >
                              {item.status === 'completed' ? 'Hoàn thành' : item.status === 'in-progress' ? 'Đang thực hiện' : 'Dự kiến'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {item.description}
                          </p>
                          {item.subcategory && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              📁 {item.subcategory}
                            </p>
                          )}
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
                        <button
                          onClick={() => setEditingItem(item)}
                          className="flex-shrink-0 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No items found</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-purple-600 text-white'
                            : 'border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 py-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          type={activeTab}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveItem}
        />
      )}
    </div>
  );
}
