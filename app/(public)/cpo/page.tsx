import { Suspense } from 'react';
import { cooRoadmap, getStats } from '@/lib/roadmap';
import { getPostCountByTopic } from '@/lib/posts';
import WorkPageClient from '../work/WorkPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CPO - Nhân sự | Dung Hoang',
  description: 'Quản lý nhân sự và văn hóa - từ tuyển dụng đến xây dựng văn hóa',
};

export default function CPOPage() {
  // Filter by role and exclude hidden items
  const visibleRoadmap = cooRoadmap.filter(item => !item.hidden && item.role === 'CPO');
  const stats = getStats('coo', visibleRoadmap);

  const roadmapWithCounts = visibleRoadmap.map(item => ({
    item,
    postCount: getPostCountByTopic(item.id),
  }));

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
      <WorkPageClient roadmapWithCounts={roadmapWithCounts} stats={stats} role="CPO" />
    </Suspense>
  );
}
