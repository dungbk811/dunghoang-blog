import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { cooRoadmap, getStats } from '@/lib/roadmap';
import { getPostCountByTopic } from '@/lib/posts';
import WorkPageClient from './WorkPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Công Việc | Dung Hoang',
  description: 'Tất cả công việc COO, CPO, CFO, CLO',
};

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function WorkPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params.category;

  // If no category filter, redirect to COO as default
  if (!category) {
    redirect('/coo');
  }

  // Get all visible work items across all roles, filtered by category
  const visibleRoadmap = cooRoadmap.filter(
    item => !item.hidden && item.category === category
  );

  // If no items found, redirect to COO
  if (visibleRoadmap.length === 0) {
    redirect('/coo');
  }

  const stats = getStats('coo', visibleRoadmap);

  const roadmapWithCounts = visibleRoadmap.map(item => ({
    item,
    postCount: getPostCountByTopic(item.id),
  }));

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
      <WorkPageClient
        roadmapWithCounts={roadmapWithCounts}
        stats={stats}
        category={category}
      />
    </Suspense>
  );
}
