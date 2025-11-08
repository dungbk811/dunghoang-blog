import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { readFileContent, writeFileContent, isGitHubConfigured } from '@/lib/github';
import matter from 'gray-matter';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug, updates } = await request.json();

    if (!slug || !updates) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Try to find and read the post file (.mdx or .md)
    const mdxPath = `content/posts/${slug}.mdx`;
    const mdPath = `content/posts/${slug}.md`;

    let filePath: string;
    let fileContents: string;

    try {
      fileContents = await readFileContent(mdxPath);
      filePath = mdxPath;
    } catch {
      try {
        fileContents = await readFileContent(mdPath);
        filePath = mdPath;
      } catch {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
    }

    const { data, content } = matter(fileContents);

    // Update metadata
    const updatedData = {
      ...data,
      ...updates,
    };

    // Write back to file
    const updatedContent = matter.stringify(content, updatedData);
    await writeFileContent(filePath, updatedContent, `Update blog post: ${slug} [via admin]`);

    // Check if using GitHub (production) or local filesystem (development)
    const requiresRebuild = isGitHubConfigured();

    return NextResponse.json({
      success: true,
      message: 'Post updated successfully',
      requiresRebuild // true if changes need deployment to be visible
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}
