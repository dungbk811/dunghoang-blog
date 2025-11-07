import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { getAllPosts } from '@/lib/posts';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// Rename category
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { oldName, newName } = await request.json();

    if (!oldName || !newName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update blog-categories.json file
    const categoriesFile = path.join(process.cwd(), 'content/blog-categories.json');
    let categories: string[] = [];
    try {
      const data = await fs.readFile(categoriesFile, 'utf-8');
      categories = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet
    }

    // Replace old category name with new one
    const index = categories.indexOf(oldName);
    if (index !== -1) {
      categories[index] = newName;
      categories.sort();
      await fs.writeFile(categoriesFile, JSON.stringify(categories, null, 2), 'utf-8');
    }

    // Get all posts with the old category
    const allPosts = getAllPosts();
    const postsToUpdate = allPosts.filter((post) => post.category === oldName);

    const postsDir = path.join(process.cwd(), 'content/posts');

    // Update each post
    for (const post of postsToUpdate) {
      const mdxPath = path.join(postsDir, `${post.slug}.mdx`);
      const mdPath = path.join(postsDir, `${post.slug}.md`);

      let filePath: string;
      if (await fs.access(mdxPath).then(() => true).catch(() => false)) {
        filePath = mdxPath;
      } else if (await fs.access(mdPath).then(() => true).catch(() => false)) {
        filePath = mdPath;
      } else {
        continue;
      }

      const fileContents = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(fileContents);

      // Update category
      data.category = newName;

      // Write back
      const updatedContent = matter.stringify(content, data);
      await fs.writeFile(filePath, updatedContent, 'utf-8');
    }

    return NextResponse.json({
      success: true,
      message: 'Category renamed successfully',
      updatedCount: postsToUpdate.length,
    });
  } catch (error) {
    console.error('Rename error:', error);
    return NextResponse.json(
      { error: 'Failed to rename category' },
      { status: 500 }
    );
  }
}

// Delete category
export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryName = searchParams.get('category');
    const action = searchParams.get('action'); // 'delete' or 'uncategorize'

    if (!categoryName || !action) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Remove from blog-categories.json file
    const categoriesFile = path.join(process.cwd(), 'content/blog-categories.json');
    let categories: string[] = [];
    try {
      const data = await fs.readFile(categoriesFile, 'utf-8');
      categories = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet
    }

    // Remove the category
    categories = categories.filter(cat => cat !== categoryName);
    await fs.writeFile(categoriesFile, JSON.stringify(categories, null, 2), 'utf-8');

    // Get all posts with the category
    const allPosts = getAllPosts();
    const postsToUpdate = allPosts.filter((post) => post.category === categoryName);

    const postsDir = path.join(process.cwd(), 'content/posts');

    if (action === 'delete') {
      // Delete all posts in the category
      for (const post of postsToUpdate) {
        const mdxPath = path.join(postsDir, `${post.slug}.mdx`);
        const mdPath = path.join(postsDir, `${post.slug}.md`);

        if (await fs.access(mdxPath).then(() => true).catch(() => false)) {
          await fs.unlink(mdxPath);
        } else if (await fs.access(mdPath).then(() => true).catch(() => false)) {
          await fs.unlink(mdPath);
        }
      }
    } else if (action === 'uncategorize') {
      // Remove category from posts (set to undefined)
      for (const post of postsToUpdate) {
        const mdxPath = path.join(postsDir, `${post.slug}.mdx`);
        const mdPath = path.join(postsDir, `${post.slug}.md`);

        let filePath: string;
        if (await fs.access(mdxPath).then(() => true).catch(() => false)) {
          filePath = mdxPath;
        } else if (await fs.access(mdPath).then(() => true).catch(() => false)) {
          filePath = mdPath;
        } else {
          continue;
        }

        const fileContents = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContents);

        // Remove category
        delete data.category;

        // Write back
        const updatedContent = matter.stringify(content, data);
        await fs.writeFile(filePath, updatedContent, 'utf-8');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      updatedCount: postsToUpdate.length,
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
