import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { getAllPosts } from '@/lib/posts';
import fs from 'fs/promises';
import path from 'path';

// GET - List all posts
export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = getAllPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('List posts error:', error);
    return NextResponse.json({ error: 'Failed to list posts' }, { status: 500 });
  }
}

// DELETE - Delete a post
export async function DELETE(request: NextRequest) {
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
      await fs.unlink(postPath);
      return NextResponse.json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      return NextResponse.json({ error: 'Post file not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
