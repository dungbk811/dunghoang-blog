'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { RoadmapItem } from '@/lib/roadmap';
import { useI18n } from '@/lib/i18n';
import LearningHeader from './LearningHeader';
import LearningClient from './LearningClient';

interface LearningPageClientProps {
  roadmapWithCounts: { item: RoadmapItem; postCount: number }[];
  stats: {
    total: number;
    planned: number;
    inProgress: number;
    completed: number;
  };
}

export default function LearningPageClient({ roadmapWithCounts, stats }: LearningPageClientProps) {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(t.common.all);

  // Read category from URL on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <LearningClient
        roadmapWithCounts={roadmapWithCounts}
        stats={stats}
        isSearchOpen={isSearchOpen}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        renderHeader={() => (
          <LearningHeader
            onSearchToggle={() => setIsSearchOpen(!isSearchOpen)}
            isSearchOpen={isSearchOpen}
          />
        )}
      />
    </div>
  );
}
