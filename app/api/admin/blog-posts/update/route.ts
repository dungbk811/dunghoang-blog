import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';
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

    // Find the post file
    const postsDir = path.join(process.cwd(), 'content/posts');
    const mdxPath = path.join(postsDir, `${slug}.mdx`);
    const mdPath = path.join(postsDir, `${slug}.md`);

    let filePath: string | null = null;

    try {
      await fs.access(mdxPath);
      filePath = mdxPath;
    } catch {
      try {
        await fs.access(mdPath);
        filePath = mdPath;
      } catch {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
    }

    // Read the file
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContents);

    // Update metadata
    const updatedData = {
      ...data,
      ...updates,
    };

    // Write back to file
    const updatedContent = matter.stringify(content, updatedData);
    await fs.writeFile(filePath, updatedContent, 'utf-8');

    return NextResponse.json({ success: true, message: 'Post updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}
