import { Suspense } from 'react';
import { cooRoadmap, getStats } from '@/lib/roadmap';
import { getPostCountByTopic } from '@/lib/posts';
import WorkPageClient from '../work/WorkPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'COO - Vận hành | Dung Hoang',
  description: 'Quản trị vận hành và xây dựng hệ thống - từ xây dựng quy trình đến phát triển hệ thống',
};

export default function COOPage() {
  // Filter by role and exclude hidden items
  const visibleRoadmap = cooRoadmap.filter(item => !item.hidden && item.role === 'COO');
  const stats = getStats('coo', visibleRoadmap);

  const roadmapWithCounts = visibleRoadmap.map(item => ({
    item,
    postCount: getPostCountByTopic(item.id),
  }));

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
      <WorkPageClient roadmapWithCounts={roadmapWithCounts} stats={stats} role="COO" />
    </Suspense>
  );
}
