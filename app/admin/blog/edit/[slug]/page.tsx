'use client';

import { use } from 'react';
import BlogPostEditor from '../../../components/BlogPostEditor';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function EditBlogPostPage({ params }: PageProps) {
  const { slug } = use(params);
  return <BlogPostEditor mode="edit" slug={slug} />;
}
