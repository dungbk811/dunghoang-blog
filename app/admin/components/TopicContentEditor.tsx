'use client';

import { useState, useEffect } from 'react';
import type { RoadmapItem } from '@/lib/roadmap';
import toast from 'react-hot-toast';

interface TopicContentEditorProps {
  item: RoadmapItem | null;
  onClose: () => void;
  onSave: () => void;
}

export default function TopicContentEditor({ item, onClose, onSave }: TopicContentEditorProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    if (item) {
      loadContent();
    }
  }, [item]);

  const loadContent = async () => {
    if (!item) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/topic-content?topicId=${item.id}`);
      const data = await response.json();

      if (data.exists) {
        setContent(data.content);
      } else {
        // Set default template
        setContent(getDefaultTemplate(item));
      }
    } catch (error) {
      console.error('Failed to load content:', error);
      setContent(getDefaultTemplate(item));
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTemplate = (item: RoadmapItem) => {
    return `# ${item.title}

${item.description}

## Mục tiêu

- [ ] Mục tiêu 1
- [ ] Mục tiêu 2
- [ ] Mục tiêu 3

## Nội dung chính

### Phần 1

Nội dung...

### Phần 2

Nội dung...

## Tài liệu tham khảo

- [Link 1](https://example.com)
- [Link 2](https://example.com)

## Ghi chú

Các ghi chú bổ sung...
`;
  };

  const handleSave = async () => {
    if (!item) return;

    setSaving(true);
    const loadingToast = toast.loading('Saving content...');

    try {
      const response = await fetch('/api/admin/topic-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId: item.id, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      toast.success('Content saved successfully!', { id: loadingToast });
      onSave();
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save content. Please try again.', { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    if (!confirm('Are you sure you want to delete this topic content?')) return;

    const loadingToast = toast.loading('Deleting content...');

    try {
      const response = await fetch(`/api/admin/topic-content?topicId=${item.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      toast.success('Content deleted successfully!', { id: loadingToast });
      onSave();
      onClose();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete content. Please try again.', { id: loadingToast });
    }
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Topic Content Editor
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {item.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'edit'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              👁️ Preview
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : activeTab === 'edit' ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full min-h-[500px] p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Write your MDX content here..."
            />
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
                dangerouslySetInnerHTML={{
                  __html: content
                    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.+?)\*/g, '<em>$1</em>')
                    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>')
                    .replace(/\n/g, '<br />')
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleDelete}
              className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Delete Content
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Content'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
