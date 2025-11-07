import { learningRoadmap } from '@/lib/roadmap';
import { getAllPosts } from '@/lib/posts';
import { getTopicContent } from '@/lib/topics';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import TopicDetailClient from './TopicDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return learningRoadmap.map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const topic = learningRoadmap.find((item) => item.id === id);

  if (!topic) {
    return {
      title: 'Topic Not Found | Dung Hoang',
    };
  }

  return {
    title: `${topic.title} | Learning Journey`,
    description: topic.description,
  };
}

export default async function TopicDetailPage({ params }: PageProps) {
  const { id } = await params;
  const topic = learningRoadmap.find((item) => item.id === id);

  if (!topic) {
    notFound();
  }

  // Get topic MDX content
  const topicContent = getTopicContent(id);

  // Get all posts for this topic
  const allPosts = getAllPosts();
  const topicPosts = allPosts.filter((post) => post.topic === topic.id);

  return (
    <TopicDetailClient
      topic={topic}
      topicContent={topicContent}
      topicPosts={topicPosts}
    />
  );
}
