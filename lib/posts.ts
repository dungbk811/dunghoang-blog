import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  category?: string;
  topic?: string; // Optional: Can link to Learning/COO topic ID (preserved for backward compatibility)
  coverImage?: string; // Cover image URL or path
  content?: string;
  hidden?: boolean; // Hide from public view (admin only)
}

export interface Post extends PostMetadata {
  content: string;
}

// Helper function to filter out hidden posts for public view
export function getPublicPosts(posts: PostMetadata[]): PostMetadata[] {
  return posts.filter(post => !post.hidden);
}

export function getAllPosts(): PostMetadata[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.(mdx|md)$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const post: any = {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        description: data.description || '',
        tags: data.tags || [],
        category: data.category || 'general',
        coverImage: data.coverImage,
        content,
        hidden: data.hidden || false,
      };

      // Keep topic for backward compatibility with Learning/COO pages
      if (data.topic) {
        post.topic = data.topic;
      }

      return post as PostMetadata;
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    let fileContents: string;

    if (fs.existsSync(fullPath)) {
      fileContents = fs.readFileSync(fullPath, 'utf8');
    } else {
      const mdPath = path.join(postsDirectory, `${slug}.md`);
      if (fs.existsSync(mdPath)) {
        fileContents = fs.readFileSync(mdPath, 'utf8');
      } else {
        return null;
      }
    }

    const { data, content } = matter(fileContents);

    const post: any = {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      description: data.description || '',
      tags: data.tags || [],
      category: data.category || 'general',
      coverImage: data.coverImage,
      content,
      hidden: data.hidden || false,
    };

    // Keep topic for backward compatibility with Learning/COO pages
    if (data.topic) {
      post.topic = data.topic;
    }

    return post;
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getPostsByCategory(category: string, includeHidden = false): PostMetadata[] {
  const allPosts = getAllPosts();
  const posts = allPosts.filter((post) => post.category === category);
  return includeHidden ? posts : getPublicPosts(posts);
}

export function getPostsByTag(tag: string, includeHidden = false): PostMetadata[] {
  const allPosts = getAllPosts();
  const posts = allPosts.filter((post) => post.tags?.includes(tag));
  return includeHidden ? posts : getPublicPosts(posts);
}

export function getAllTags(includeHidden = false): string[] {
  const allPosts = includeHidden ? getAllPosts() : getPublicPosts(getAllPosts());
  const tags = new Set<string>();
  allPosts.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
}

export function getAllCategories(includeHidden = false): string[] {
  // Read from blog-categories.json file
  const categoriesFile = path.join(process.cwd(), 'content/blog-categories.json');
  let predefinedCategories: string[] = [];

  try {
    const data = fs.readFileSync(categoriesFile, 'utf-8');
    predefinedCategories = JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, ignore
  }

  // Also get categories from existing posts
  const allPosts = includeHidden ? getAllPosts() : getPublicPosts(getAllPosts());
  const categoriesFromPosts = new Set<string>();
  allPosts.forEach((post) => {
    if (post.category) categoriesFromPosts.add(post.category);
  });

  // Merge both sources
  const allCategories = new Set([...predefinedCategories, ...categoriesFromPosts]);
  return Array.from(allCategories).sort();
}

export function getPostsByTopic(topic: string, includeHidden = false): PostMetadata[] {
  const allPosts = getAllPosts();
  const posts = allPosts.filter((post) => (post as any).topic === topic);
  return includeHidden ? posts : getPublicPosts(posts);
}

export function getPostCountByTopic(topic: string, includeHidden = false): number {
  return getPostsByTopic(topic, includeHidden).length;
}
