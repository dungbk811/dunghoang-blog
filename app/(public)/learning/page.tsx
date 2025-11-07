import { Suspense } from 'react';
import { learningRoadmap, getStats } from '@/lib/roadmap';
import { getPostCountByTopic } from '@/lib/posts';
import LearningPageClient from './LearningPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giỏ Kiến Thức | Dung Hoang - COO',
  description: 'Lộ trình học tập IT - từ kỹ năng cơ bản đến chuyên sâu, ghi chép hành trình học tập',
};

export default function LearningPage() {
  // Filter out hidden items for public view
  const visibleRoadmap = learningRoadmap.filter(item => !item.hidden);
  const stats = getStats('learning', visibleRoadmap);

  const roadmapWithCounts = visibleRoadmap.map(item => ({
    item,
    postCount: getPostCountByTopic(item.id), // Default: includeHidden=false
  }));

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
      <LearningPageClient roadmapWithCounts={roadmapWithCounts} stats={stats} />
    </Suspense>
  );
}
