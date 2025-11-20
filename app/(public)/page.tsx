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

  // Get stats for each role
  const cooStats = getStats('coo', visibleCooRoadmap.filter(item => item.role === 'COO'));
  const cpoStats = getStats('coo', visibleCooRoadmap.filter(item => item.role === 'CPO'));
  const cfoStats = getStats('coo', visibleCooRoadmap.filter(item => item.role === 'CFO'));
  const cloStats = getStats('coo', visibleCooRoadmap.filter(item => item.role === 'CLO'));

  return (
    <DashboardClient
      learningStats={learningStats}
      cooStats={cooStats}
      cpoStats={cpoStats}
      cfoStats={cfoStats}
      cloStats={cloStats}
      postsCount={visiblePosts.length}
    />
  );
}
