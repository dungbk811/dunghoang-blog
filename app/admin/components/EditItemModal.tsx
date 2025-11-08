'use client';

import { useState } from 'react';
import type { RoadmapItem, RoadmapStatus, SkillLevel } from '@/lib/roadmap';
import { learningRoadmap, cooRoadmap } from '@/lib/roadmap';
import toast from 'react-hot-toast';

interface EditItemModalProps {
  item: RoadmapItem | null;
  type: 'learning' | 'coo';
  onClose: () => void;
  onSave: (itemIdOrData: string | Partial<RoadmapItem>, updates?: Partial<RoadmapItem>) => Promise<void>;
}

export default function EditItemModal({ item, type, onClose, onSave }: EditItemModalProps) {
  const isAddMode = !item;

  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [status, setStatus] = useState<RoadmapStatus>(item?.status || 'planned');
  const [level, setLevel] = useState<SkillLevel>(item?.level || 'beginner');
  const [category, setCategory] = useState(item?.category || '');
  const [subcategory, setSubcategory] = useState(item?.subcategory || '');
  const [startDate, setStartDate] = useState(item?.startDate || '');
  const [targetDate, setTargetDate] = useState(item?.targetDate || '');
  const [saving, setSaving] = useState(false);

  // Relationships
  const [relatedWorkIds, setRelatedWorkIds] = useState<string[]>(item?.relatedWorkIds || []);
  const [relatedLearningIds, setRelatedLearningIds] = useState<string[]>(item?.relatedLearningIds || []);

  // Get available items for relationship selection
  const availableItems = type === 'learning' ? cooRoadmap : learningRoadmap;
  const selectedIds = type === 'learning' ? relatedWorkIds : relatedLearningIds;
  const setSelectedIds = type === 'learning' ? setRelatedWorkIds : setRelatedLearningIds;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const loadingToast = toast.loading(isAddMode ? 'Adding new item...' : 'Saving changes...');

    try {
      if (isAddMode) {
        // Add mode: pass new item data as first parameter
        await onSave({
          title,
          description,
          status,
          level,
          category,
          subcategory: subcategory || undefined,
          startDate: startDate || undefined,
          targetDate: targetDate || undefined,
          relatedWorkIds: type === 'learning' ? relatedWorkIds : undefined,
          relatedLearningIds: type === 'coo' ? relatedLearningIds : undefined,
        });
      } else {
        // Edit mode: pass itemId and updates
        await onSave(item!.id, {
          status,
          level,
          category,
          subcategory: subcategory || undefined,
          startDate: startDate || undefined,
          targetDate: targetDate || undefined,
          relatedWorkIds: type === 'learning' ? relatedWorkIds : undefined,
          relatedLearningIds: type === 'coo' ? relatedLearningIds : undefined,
        });
      }

      toast.success(isAddMode ? 'Item added successfully!' : 'Changes saved successfully!', { id: loadingToast });
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error(isAddMode ? 'Failed to add item. Please try again.' : 'Failed to save changes. Please try again.', { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isAddMode ? 'Add New Topic' : 'Edit Item'}
            </h2>
            {!isAddMode && item && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {item.title}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title (Add mode only) */}
          {isAddMode && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                placeholder="Enter topic title"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description {isAddMode && <span className="text-red-500">*</span>}
            </label>
            {isAddMode ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                placeholder="Enter topic description"
              />
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-700 dark:text-slate-300">{item?.description}</p>
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              placeholder="e.g., Giao Tiếp & Giọng Nói"
            />
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Subcategory (Optional)
            </label>
            <input
              type="text"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Luyện Giọng & Phát Âm"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RoadmapStatus)}
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all"
                required
              >
                <option value="planned">📝 Planned</option>
                <option value="in-progress">⚙️ In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Level <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as SkillLevel)}
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all"
                required
              >
                <option value="beginner">🟢 Beginner (Sơ Cấp)</option>
                <option value="intermediate">🟡 Intermediate (Trung Cấp)</option>
                <option value="advanced">🔴 Advanced (Cao Cấp)</option>
                <option value="expert">💎 Expert (Chuyên Gia)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Target Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Target Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Tags (Read-only for now) */}
          {!isAddMode && item?.tags && item.tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Items */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              {type === 'learning' ? 'Related COO Work' : 'Related Learning Topics'}
            </label>
            <div className="max-h-48 overflow-y-auto space-y-2 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
              {availableItems.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                  No items available
                </p>
              ) : (
                availableItems.map((relatedItem) => (
                  <label
                    key={relatedItem.id}
                    className="flex items-start gap-3 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(relatedItem.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds([...selectedIds, relatedItem.id]);
                        } else {
                          setSelectedIds(selectedIds.filter(id => id !== relatedItem.id));
                        }
                      }}
                      className="mt-1 w-4 h-4 text-blue-600 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {relatedItem.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {relatedItem.category}
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isAddMode ? 'Adding...' : 'Saving...'}
                </>
              ) : (
                isAddMode ? 'Add Topic' : 'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
