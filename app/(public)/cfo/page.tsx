import { Suspense } from 'react';
import { cooRoadmap, getStats } from '@/lib/roadmap';
import { getPostCountByTopic } from '@/lib/posts';
import WorkPageClient from '../work/WorkPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CFO - Tài chính | Dung Hoang',
  description: 'Quản lý tài chính - từ lập ngân sách đến báo cáo tài chính',
};

export default function CFOPage() {
  // Filter by role and exclude hidden items
  const visibleRoadmap = cooRoadmap.filter(item => !item.hidden && item.role === 'CFO');
  const stats = getStats('coo', visibleRoadmap);

  const roadmapWithCounts = visibleRoadmap.map(item => ({
    item,
    postCount: getPostCountByTopic(item.id),
  }));

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
      <WorkPageClient roadmapWithCounts={roadmapWithCounts} stats={stats} role="CFO" />
    </Suspense>
  );
}
