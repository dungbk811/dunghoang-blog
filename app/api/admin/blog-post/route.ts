import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { readFileContent, writeFileContent, isGitHubConfigured } from '@/lib/github';
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

    const postPath = `content/posts/${slug}.mdx`;

    try {
      const fileContent = await readFileContent(postPath);
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

    const postPath = `content/posts/${slug}.mdx`;

    // Check if file already exists when creating
    if (mode === 'create') {
      try {
        await readFileContent(postPath);
        return NextResponse.json(
          { error: 'Post with this slug already exists' },
          { status: 409 }
        );
      } catch {
        // File doesn't exist, good to create
      }
    }

    // Build frontmatter string with proper YAML formatting
    const frontmatterString = Object.entries(frontmatter)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => {
        // Handle arrays (tags) - use YAML list format
        if (Array.isArray(value)) {
          if (value.length === 0) return null;
          return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`;
        }
        // Handle booleans - no quotes
        if (typeof value === 'boolean') {
          return `${key}: ${value}`;
        }
        // Handle strings with newlines (description) - use YAML block scalar
        if (typeof value === 'string' && value.includes('\n')) {
          const lines = value.split('\n').map(line => `  ${line}`).join('\n');
          return `${key}: >-\n${lines}`;
        }
        // Handle regular strings - add quotes if needed (dates, titles, etc)
        if (typeof value === 'string') {
          // For dates, keep single quotes
          if (key === 'date') {
            return `${key}: '${value}'`;
          }
          // For category and topic, no quotes needed (simple identifiers)
          if (key === 'category' || key === 'topic') {
            return `${key}: ${value}`;
          }
          // For title and other strings, always use quotes for safety
          // Escape single quotes by doubling them
          const escapedValue = value.replace(/'/g, "''");
          return `${key}: '${escapedValue}'`;
        }
        return `${key}: ${value}`;
      })
      .filter(Boolean)
      .join('\n');

    // Build full MDX content
    const fullContent = `---
${frontmatterString}
---

${content}`;

    // Write to file (uses GitHub API on production, local filesystem on development)
    const commitMessage = mode === 'create'
      ? `Create blog post: ${slug} [via admin]`
      : `Update blog post: ${slug} [via admin]`;
    await writeFileContent(postPath, fullContent, commitMessage);

    const requiresRebuild = isGitHubConfigured();

    return NextResponse.json({
      success: true,
      message: mode === 'create' ? 'Post created successfully' : 'Post updated successfully',
      slug,
      requiresRebuild
    });
  } catch (error) {
    console.error('Write post error:', error);
    return NextResponse.json(
      { error: 'Failed to save post' },
      { status: 500 }
    );
  }
}
