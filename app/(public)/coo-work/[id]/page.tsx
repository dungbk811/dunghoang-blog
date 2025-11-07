import { cooRoadmap } from '@/lib/roadmap';
import { getAllPosts } from '@/lib/posts';
import { getTopicContent } from '@/lib/topics';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import TaskDetailClient from './TaskDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return cooRoadmap.map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const task = cooRoadmap.find((item) => item.id === id);

  if (!task) {
    return {
      title: 'Task Not Found | Dung Hoang',
    };
  }

  return {
    title: `${task.title} | COO Work`,
    description: task.description,
  };
}

export default async function TaskDetailPage({ params }: PageProps) {
  const { id } = await params;
  const task = cooRoadmap.find((item) => item.id === id);

  if (!task) {
    notFound();
  }

  // Get topic MDX content
  const topicContent = getTopicContent(id);

  // Get all posts for this task
  const allPosts = getAllPosts();
  const taskPosts = allPosts.filter((post) => post.topic === task.id);

  return (
    <TaskDetailClient
      task={task}
      topicContent={topicContent}
      taskPosts={taskPosts}
    />
  );
}
