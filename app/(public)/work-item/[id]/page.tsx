import { cooRoadmap } from '@/lib/roadmap';
import { getAllPosts, getPublicPosts } from '@/lib/posts';
import { getTopicContent } from '@/lib/topics';
import { rolesSettings } from '@/lib/profile';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import TaskDetailClient from './TaskDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  // Generate static params for all visible work items (all roles)
  return cooRoadmap
    .filter((item) => !item.hidden)
    .map((item) => ({
      id: item.id,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const task = cooRoadmap.find((item) => item.id === id && !item.hidden);

  if (!task) {
    return {
      title: 'Task Not Found | Dung Hoang',
    };
  }

  const roleLabel = task.role ? rolesSettings[task.role]?.shortLabel || 'Work' : 'Work';
  return {
    title: `${task.title} | ${roleLabel}`,
    description: task.description,
  };
}

export default async function TaskDetailPage({ params }: PageProps) {
  const { id } = await params;
  const task = cooRoadmap.find((item) => item.id === id && !item.hidden);

  // Return 404 if task not found or is hidden
  if (!task) {
    notFound();
  }

  // Get topic MDX content
  const topicContent = getTopicContent(id);

  // Get all posts for this task (filter out hidden posts)
  const allPosts = getPublicPosts(getAllPosts());
  const taskPosts = allPosts.filter((post) => post.topic === task.id);

  return (
    <TaskDetailClient
      task={task}
      topicContent={topicContent}
      taskPosts={taskPosts}
    />
  );
}
