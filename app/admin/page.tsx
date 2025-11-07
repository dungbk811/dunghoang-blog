import { learningRoadmap, cooRoadmap } from '@/lib/roadmap';
import { getAllPosts } from '@/lib/posts';
import DashboardContent from './DashboardContent';

export default function AdminDashboardPage() {
  const learningStats = {
    total: learningRoadmap.length,
    planned: learningRoadmap.filter((i) => i.status === 'planned').length,
    inProgress: learningRoadmap.filter((i) => i.status === 'in-progress').length,
    completed: learningRoadmap.filter((i) => i.status === 'completed').length,
  };

  const cooStats = {
    total: cooRoadmap.length,
    planned: cooRoadmap.filter((i) => i.status === 'planned').length,
    inProgress: cooRoadmap.filter((i) => i.status === 'in-progress').length,
    completed: cooRoadmap.filter((i) => i.status === 'completed').length,
  };

  const allPosts = getAllPosts();
  const postStats = {
    total: allPosts.length,
    visible: allPosts.filter((p) => !p.hidden).length,
    hidden: allPosts.filter((p) => p.hidden).length,
  };

  return (
    <DashboardContent
      learningStats={learningStats}
      cooStats={cooStats}
      postStats={postStats}
    />
  );
}
