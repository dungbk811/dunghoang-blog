import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

// GET - Read topic content
export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get('topicId');

    if (!topicId) {
      return NextResponse.json({ error: 'Topic ID is required' }, { status: 400 });
    }

    const topicPath = path.join(process.cwd(), 'content', 'topics', `${topicId}.mdx`);

    try {
      const content = await fs.readFile(topicPath, 'utf-8');
      return NextResponse.json({ content, exists: true });
    } catch (error) {
      // File doesn't exist yet
      return NextResponse.json({ content: '', exists: false });
    }
  } catch (error) {
    console.error('Read topic error:', error);
    return NextResponse.json({ error: 'Failed to read topic' }, { status: 500 });
  }
}

// POST - Write topic content
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topicId, content } = await request.json();

    if (!topicId || content === undefined) {
      return NextResponse.json(
        { error: 'Topic ID and content are required' },
        { status: 400 }
      );
    }

    const topicsDir = path.join(process.cwd(), 'content', 'topics');
    const topicPath = path.join(topicsDir, `${topicId}.mdx`);

    // Ensure topics directory exists
    try {
      await fs.access(topicsDir);
    } catch {
      await fs.mkdir(topicsDir, { recursive: true });
    }

    // Write content to file
    await fs.writeFile(topicPath, content, 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Topic content saved successfully'
    });
  } catch (error) {
    console.error('Write topic error:', error);
    return NextResponse.json(
      { error: 'Failed to save topic content' },
      { status: 500 }
    );
  }
}

// DELETE - Delete topic content
export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get('topicId');

    if (!topicId) {
      return NextResponse.json({ error: 'Topic ID is required' }, { status: 400 });
    }

    const topicPath = path.join(process.cwd(), 'content', 'topics', `${topicId}.mdx`);

    try {
      await fs.unlink(topicPath);
      return NextResponse.json({
        success: true,
        message: 'Topic content deleted successfully'
      });
    } catch (error) {
      return NextResponse.json({ error: 'Topic file not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Delete topic error:', error);
    return NextResponse.json(
      { error: 'Failed to delete topic content' },
      { status: 500 }
    );
  }
}
