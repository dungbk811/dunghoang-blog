import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const topicsDirectory = path.join(process.cwd(), 'content/topics');

export interface TopicContent {
  id: string;
  content: string;
  frontmatter: {
    title: string;
    description: string;
  };
}

export function getTopicContent(id: string): TopicContent | null {
  try {
    const fullPath = path.join(topicsDirectory, `${id}.mdx`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      id,
      content,
      frontmatter: data as TopicContent['frontmatter'],
    };
  } catch (error) {
    console.error(`Error reading topic ${id}:`, error);
    return null;
  }
}

export function getAllTopicIds(): string[] {
  try {
    if (!fs.existsSync(topicsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(topicsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => fileName.replace(/\.mdx$/, ''));
  } catch (error) {
    console.error('Error reading topics directory:', error);
    return [];
  }
}
