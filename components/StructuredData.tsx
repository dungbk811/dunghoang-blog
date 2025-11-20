import { PostMetadata } from '@/lib/posts';

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dung Hoang Blog',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://dunghoang.com',
    description: 'Chia sẻ kiến thức IT, công việc quản lý và định hướng nghề nghiệp',
    author: {
      '@type': 'Person',
      name: 'Dung Hoang',
      jobTitle: 'Chief Operating Officer',
      url: process.env.NEXT_PUBLIC_BASE_URL || 'https://dunghoang.com',
    },
    publisher: {
      '@type': 'Person',
      name: 'Dung Hoang',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function PersonSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Dung Hoang',
    jobTitle: 'Chief Operating Officer',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://dunghoang.com',
    sameAs: [
      'https://linkedin.com/in/dung-hoang-18092654',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BlogPostSchema({ post }: { post: PostMetadata }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dunghoang.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Dung Hoang',
      jobTitle: 'Chief Operating Officer',
    },
    publisher: {
      '@type': 'Person',
      name: 'Dung Hoang',
    },
    url: `${baseUrl}/blog/${post.slug}`,
    ...(post.coverImage && {
      image: {
        '@type': 'ImageObject',
        url: post.coverImage.startsWith('http') ? post.coverImage : `${baseUrl}${post.coverImage}`,
      },
    }),
    ...(post.tags && {
      keywords: post.tags.join(', '),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dunghoang.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
