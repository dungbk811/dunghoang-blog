import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts';
import BlogManager from './BlogManager';

export default function BlogManagementPage() {
  // Get all posts (including hidden for admin)
  const allPosts = getAllPosts();

  // Get all categories and tags
  const categories = getAllCategories(true); // include hidden
  const tags = getAllTags(true); // include hidden

  // Format posts for client component
  const posts = allPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    category: post.category,
    tags: post.tags,
    hidden: post.hidden,
  }));

  return <BlogManager posts={posts} categories={categories} tags={tags} />;
}
