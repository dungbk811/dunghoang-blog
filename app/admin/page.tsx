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

  // Calculate stats for each role
  const cooItems = cooRoadmap.filter((i) => i.role === 'COO');
  const cooStats = {
    total: cooItems.length,
    planned: cooItems.filter((i) => i.status === 'planned').length,
    inProgress: cooItems.filter((i) => i.status === 'in-progress').length,
    completed: cooItems.filter((i) => i.status === 'completed').length,
  };

  const cpoItems = cooRoadmap.filter((i) => i.role === 'CPO');
  const cpoStats = {
    total: cpoItems.length,
    planned: cpoItems.filter((i) => i.status === 'planned').length,
    inProgress: cpoItems.filter((i) => i.status === 'in-progress').length,
    completed: cpoItems.filter((i) => i.status === 'completed').length,
  };

  const cfoItems = cooRoadmap.filter((i) => i.role === 'CFO');
  const cfoStats = {
    total: cfoItems.length,
    planned: cfoItems.filter((i) => i.status === 'planned').length,
    inProgress: cfoItems.filter((i) => i.status === 'in-progress').length,
    completed: cfoItems.filter((i) => i.status === 'completed').length,
  };

  const cloItems = cooRoadmap.filter((i) => i.role === 'CLO');
  const cloStats = {
    total: cloItems.length,
    planned: cloItems.filter((i) => i.status === 'planned').length,
    inProgress: cloItems.filter((i) => i.status === 'in-progress').length,
    completed: cloItems.filter((i) => i.status === 'completed').length,
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
      cpoStats={cpoStats}
      cfoStats={cfoStats}
      cloStats={cloStats}
      postStats={postStats}
    />
  );
}
