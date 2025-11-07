import { Suspense } from 'react';
import { cooRoadmap, getStats } from '@/lib/roadmap';
import { getPostCountByTopic } from '@/lib/posts';
import COOWorkPageClient from './COOWorkPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Công Việc COO | Dung Hoang - COO',
  description: 'Quản trị vận hành - từ xây dựng quy trình đến phát triển hệ thống',
};

export default function COOWorkPage() {
  // Filter out hidden items for public view
  const visibleRoadmap = cooRoadmap.filter(item => !item.hidden);
  const stats = getStats('coo', visibleRoadmap);

  const roadmapWithCounts = visibleRoadmap.map(item => ({
    item,
    postCount: getPostCountByTopic(item.id), // Default: includeHidden=false
  }));

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
      <COOWorkPageClient roadmapWithCounts={roadmapWithCounts} stats={stats} />
    </Suspense>
  );
}
