'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { RoadmapItem, WorkRole } from '@/lib/roadmap';
import { useI18n } from '@/lib/i18n';
import WorkHeader from './WorkHeader';
import WorkClient from './WorkClient';

interface WorkPageClientProps {
  roadmapWithCounts: { item: RoadmapItem; postCount: number }[];
  stats: {
    total: number;
    planned: number;
    inProgress: number;
    completed: number;
  };
  role?: WorkRole;
  category?: string;
}

export default function WorkPageClient({ roadmapWithCounts, stats, role, category }: WorkPageClientProps) {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(t.common.all);

  // Read category from URL or use provided category
  useEffect(() => {
    if (category) {
      setActiveCategory(category);
    } else {
      const categoryParam = searchParams.get('category');
      if (categoryParam) {
        setActiveCategory(categoryParam);
      }
    }
  }, [searchParams, category]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <WorkClient
        roadmapWithCounts={roadmapWithCounts}
        stats={stats}
        isSearchOpen={isSearchOpen}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        role={role || 'COO'}
        renderHeader={() => (
          <WorkHeader
            onSearchToggle={() => setIsSearchOpen(!isSearchOpen)}
            isSearchOpen={isSearchOpen}
            role={role}
            category={category}
          />
        )}
      />
    </div>
  );
}
