import { Suspense } from 'react';
import { cooRoadmap, getStats } from '@/lib/roadmap';
import { getPostCountByTopic } from '@/lib/posts';
import WorkPageClient from '../work/WorkPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CLO - Pháp lý | Dung Hoang',
  description: 'Quản lý pháp lý - từ hợp đồng đến tuân thủ quy định',
};

export default function CLOPage() {
  // Filter by role and exclude hidden items
  const visibleRoadmap = cooRoadmap.filter(item => !item.hidden && item.role === 'CLO');
  const stats = getStats('coo', visibleRoadmap);

  const roadmapWithCounts = visibleRoadmap.map(item => ({
    item,
    postCount: getPostCountByTopic(item.id),
  }));

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
      <WorkPageClient roadmapWithCounts={roadmapWithCounts} stats={stats} role="CLO" />
    </Suspense>
  );
}
