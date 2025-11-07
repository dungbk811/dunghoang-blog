import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

// Create new category
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const categoriesFile = path.join(process.cwd(), 'content/blog-categories.json');

    // Read existing categories
    let categories: string[] = [];
    try {
      const data = await fs.readFile(categoriesFile, 'utf-8');
      categories = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, start with empty array
      categories = [];
    }

    // Check if category already exists
    if (categories.includes(name.trim())) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 409 }
      );
    }

    // Add new category
    categories.push(name.trim());
    categories.sort();

    // Ensure content directory exists
    const contentDir = path.join(process.cwd(), 'content');
    try {
      await fs.access(contentDir);
    } catch {
      await fs.mkdir(contentDir, { recursive: true });
    }

    // Write back to file
    await fs.writeFile(categoriesFile, JSON.stringify(categories, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category: name.trim(),
    });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
