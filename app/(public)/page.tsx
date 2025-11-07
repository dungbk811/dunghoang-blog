import { getAllPosts } from '@/lib/posts';
import { getStats, learningRoadmap, cooRoadmap } from '@/lib/roadmap';
import DashboardClient from './DashboardClient';

export default function Home() {
  // Filter out hidden items for public view
  const visibleLearningRoadmap = learningRoadmap.filter(item => !item.hidden);
  const visibleCooRoadmap = cooRoadmap.filter(item => !item.hidden);

  const allPosts = getAllPosts();
  const visiblePosts = allPosts.filter(post => !post.hidden);

  const learningStats = getStats('learning', visibleLearningRoadmap);
  const cooStats = getStats('coo', visibleCooRoadmap);

  return (
    <DashboardClient
      learningStats={learningStats}
      cooStats={cooStats}
      postsCount={visiblePosts.length}
    />
  );
}
