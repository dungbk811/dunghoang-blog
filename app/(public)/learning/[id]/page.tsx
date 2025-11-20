import { learningRoadmap } from '@/lib/roadmap';
import { getAllPosts, getPublicPosts } from '@/lib/posts';
import { getTopicContent } from '@/lib/topics';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import TopicDetailClient from './TopicDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  // Only generate static params for visible learning topics
  return learningRoadmap
    .filter((item) => !item.hidden)
    .map((item) => ({
      id: item.id,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const topic = learningRoadmap.find((item) => item.id === id && !item.hidden);

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
  const topic = learningRoadmap.find((item) => item.id === id && !item.hidden);

  // Return 404 if topic not found or is hidden
  if (!topic) {
    notFound();
  }

  // Get topic MDX content
  const topicContent = getTopicContent(id);

  // Get all posts for this topic (filter out hidden posts)
  const allPosts = getPublicPosts(getAllPosts());
  const topicPosts = allPosts.filter((post) => post.topic === topic.id);

  return (
    <TopicDetailClient
      topic={topic}
      topicContent={topicContent}
      topicPosts={topicPosts}
    />
  );
}
