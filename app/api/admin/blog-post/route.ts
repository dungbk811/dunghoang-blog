import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// GET - Read a single post
export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const postPath = path.join(process.cwd(), 'content', 'posts', `${slug}.mdx`);

    try {
      const fileContent = await fs.readFile(postPath, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent);

      return NextResponse.json({
        post: {
          ...frontmatter,
          content,
        }
      });
    } catch (error) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Read post error:', error);
    return NextResponse.json({ error: 'Failed to read post' }, { status: 500 });
  }
}

// POST - Create or update a post
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug, frontmatter, content, mode } = await request.json();

    if (!slug || !frontmatter || content === undefined) {
      return NextResponse.json(
        { error: 'Slug, frontmatter, and content are required' },
        { status: 400 }
      );
    }

    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const postPath = path.join(postsDir, `${slug}.mdx`);

    // Ensure posts directory exists
    try {
      await fs.access(postsDir);
    } catch {
      await fs.mkdir(postsDir, { recursive: true });
    }

    // Check if file already exists when creating
    if (mode === 'create') {
      try {
        await fs.access(postPath);
        return NextResponse.json(
          { error: 'Post with this slug already exists' },
          { status: 409 }
        );
      } catch {
        // File doesn't exist, good to create
      }
    }

    // Build frontmatter string
    const frontmatterString = Object.entries(frontmatter)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
        }
        return `${key}: "${value}"`;
      })
      .join('\n');

    // Build full MDX content
    const fullContent = `---
${frontmatterString}
---

${content}`;

    // Write to file
    await fs.writeFile(postPath, fullContent, 'utf-8');

    return NextResponse.json({
      success: true,
      message: mode === 'create' ? 'Post created successfully' : 'Post updated successfully',
      slug
    });
  } catch (error) {
    console.error('Write post error:', error);
    return NextResponse.json(
      { error: 'Failed to save post' },
      { status: 500 }
    );
  }
}
