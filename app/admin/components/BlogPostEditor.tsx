'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminLanguage } from '@/contexts/AdminLanguageContext';
import { learningRoadmap, cooRoadmap } from '@/lib/roadmap';

interface BlogPostEditorProps {
  mode: 'create' | 'edit';
  slug?: string;
}

interface TopicOption {
  id: string;
  title: string;
  category: string;
}

// Helper function to get the correct route for a topic
function getTopicRoute(topicId: string): string {
  // Learning topics
  if (topicId.endsWith('-learning')) {
    return `/admin/learning/${topicId}`;
  }

  // Work items - need to determine role
  const workItem = cooRoadmap.find(item => item.id === topicId);
  if (workItem) {
    const role = workItem.role?.toLowerCase() || 'coo';
    return `/admin/${role}-work/${topicId}`;
  }

  // Fallback to blog list if not found
  return '/admin/blog';
}

export default function BlogPostEditor({ mode, slug }: BlogPostEditorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useAdminLanguage();
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [topic, setTopic] = useState('');
  const [tags, setTags] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hidden, setHidden] = useState(true); // Default: hidden when creating
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [availableTopics, setAvailableTopics] = useState<TopicOption[]>([]);

  // Load existing categories and topics on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Fetch categories
        const postsResponse = await fetch('/api/admin/blog-posts');
        const postsData = await postsResponse.json();
        if (postsData.posts) {
          const cats = new Set<string>();
          postsData.posts.forEach((post: any) => {
            if (post.category) cats.add(post.category);
          });
          setExistingCategories(Array.from(cats).sort());
        }

        // Fetch topics from roadmap
        const roadmapResponse = await fetch('/api/admin/roadmap');
        const roadmapData = await roadmapResponse.json();
        if (roadmapData.learning || roadmapData.work) {
          const topics: TopicOption[] = [];

          // Add learning topics
          if (roadmapData.learning) {
            roadmapData.learning.forEach((item: any) => {
              topics.push({
                id: item.id,
                title: item.title,
                category: `Learning: ${item.category}`
              });
            });
          }

          // Add work topics
          if (roadmapData.work) {
            roadmapData.work.forEach((item: any) => {
              topics.push({
                id: item.id,
                title: item.title,
                category: `${item.role || 'COO'}: ${item.category}`
              });
            });
          }

          setAvailableTopics(topics);
        }
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
      }
    };
    fetchMetadata();

    // Set topic from URL parameter if creating new post
    if (mode === 'create') {
      const topicParam = searchParams.get('topic');
      if (topicParam) {
        setTopic(topicParam);
      }
    }
  }, [mode, searchParams]);

  useEffect(() => {
    if (mode === 'edit' && slug) {
      loadPost();
    }
  }, [mode, slug]);

  const loadPost = async () => {
    if (!slug) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/blog-post?slug=${slug}`);
      const data = await response.json();

      if (data.post) {
        setTitle(data.post.title || '');
        setDescription(data.post.description || '');
        setContent(data.post.content || '');
        setCategory(data.post.category || '');
        setTopic(data.post.topic || '');
        setTags(data.post.tags?.join(', ') || '');
        setDate(data.post.date || '');
        setHidden(data.post.hidden || false);
      }
    } catch (error) {
      console.error('Failed to load post:', error);
      alert(t.blogEditor.failedToLoad);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert(t.blogEditor.titleContentRequired);
      return;
    }

    setSaving(true);
    try {
      const postSlug = mode === 'create' ? generateSlug(title) : slug;
      const frontmatter: any = {
        title: title.trim(),
        description: description.trim(),
        date,
        category: category.trim() || undefined,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        hidden,
      };

      // Add topic if selected
      if (topic) {
        frontmatter.topic = topic;
      }

      const response = await fetch('/api/admin/blog-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: postSlug,
          frontmatter,
          content: content.trim(),
          mode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      router.push('/admin/blog');
      router.refresh();
    } catch (error) {
      console.error('Save error:', error);
      alert(t.blogEditor.failedToSave);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Get selected topic info for display
  const selectedTopic = availableTopics.find(t => t.id === topic);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {mode === 'create' ? t.blogEditor.createTitle : t.blogEditor.editTitle}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {mode === 'create' ? t.blogEditor.writeNewPost : `${t.blogEditor.editing}: ${slug}`}
            </p>
          </div>
          <button
            onClick={() => {
              // If creating/editing for a topic, go back to that topic's detail page
              const topicParam = searchParams.get('topic');
              if (topicParam) {
                router.push(getTopicRoute(topicParam));
              } else if (topic) {
                router.push(getTopicRoute(topic));
              } else {
                router.push('/admin/blog');
              }
            }}
            className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {t.blogEditor.backToList}
          </button>
        </div>

        {/* Topic Indicator Banner */}
        {selectedTopic && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                  Creating post for topic: <span className="font-bold">{selectedTopic.title}</span>
                </p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-0.5">
                  {selectedTopic.category}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Metadata */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t.blogEditor.metadata}
            </h3>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.blogEditor.title} <span className="text-red-500">{t.blogEditor.titleRequired}</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={t.blogEditor.titlePlaceholder}
                required
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.blogEditor.description}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder={t.blogEditor.descriptionPlaceholder}
              />
            </div>

            {/* Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.blogEditor.publishDate}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category - Only show when NOT creating/editing for a topic */}
            {!topic && !searchParams.get('topic') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.blogEditor.category}
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer transition-all"
                  >
                    <option value="">{t.blogEditor.selectCategory}</option>
                    {existingCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t.blogEditor.categoryHint}
                </p>
              </div>
            )}

            {/* Topic - Only show when post has topic OR creating from topic page */}
            {(topic || searchParams.get('topic')) && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Related Topic
                </label>
                <div className="relative">
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer transition-all"
                  >
                    <option value="">Remove topic link</option>
                    {availableTopics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.category})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This post is linked to a specific topic
                </p>
              </div>
            )}

            {/* Tags */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.blogEditor.tags}
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={t.blogEditor.tagsPlaceholder}
              />
            </div>

            {/* Visibility Toggle */}
            <div>
              <label className="flex items-center justify-between p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={hidden ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {hidden ? 'Hidden from public' : 'Visible to public'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {hidden ? 'Only visible in admin panel' : 'Appears in blog list'}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hidden}
                  onChange={(e) => setHidden(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
              </label>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t.blogEditor.saving}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {mode === 'create' ? t.blogEditor.createPost : t.blogEditor.updatePost}
              </>
            )}
          </button>
        </div>

        {/* Right: Content Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex gap-2">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'edit'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {t.blogEditor.editTab}
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {t.blogEditor.previewTab}
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'edit' ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-[600px] p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder={t.blogEditor.contentPlaceholder}
                />
              ) : (
                <div className="prose prose-slate dark:prose-invert max-w-none min-h-[600px]">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: content
                        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.+?)\*/g, '<em>$1</em>')
                        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>')
                        .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">$1</code>')
                        .replace(/\n/g, '<br />')
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
