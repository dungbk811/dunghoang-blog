import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts';
import BlogClient from './BlogClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chia Sẻ | Dung Hoang - COO',
  description: 'Bài viết về IT, công nghệ, quản lý và định hướng nghề nghiệp',
};

export default function BlogPage() {
  // getAllPosts, getAllCategories, and getAllTags filter hidden items by default
  const allPosts = getAllPosts();
  // Only show posts that are not hidden
  const visiblePosts = allPosts.filter(post => !post.hidden);
  const categories = getAllCategories(); // Already filters hidden
  const tags = getAllTags(); // Already filters hidden

  return <BlogClient posts={visiblePosts} categories={categories} tags={tags} />;
}
