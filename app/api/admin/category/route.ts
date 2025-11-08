import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { readFileContent, writeFileContent, isGitHubConfigured } from '@/lib/github';

// DELETE: Delete a category
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { category, type, deleteTopics } = await request.json();

    if (!category || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Read the roadmap file
    const roadmapPath = 'lib/roadmap.ts';
    let content = await readFileContent(roadmapPath);

    // Determine which roadmap array to work with
    const arrayName = type === 'learning' ? 'learningRoadmap' : 'cooRoadmap';

    if (deleteTopics) {
      // Delete all items in this category
      // Find all items with this category and remove them
      const itemRegex = new RegExp(
        `\\{[^}]*category:\\s*'${category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[^}]*\\},?`,
        'gs'
      );

      content = content.replace(itemRegex, '');

      // Clean up any double commas or trailing commas
      content = content.replace(/,(\s*),/g, ',');
      content = content.replace(/\[\s*,/g, '[');
      content = content.replace(/,\s*\]/g, ']');
    } else {
      // Move items to "Uncategorized"
      const categoryRegex = new RegExp(
        `category:\\s*'${category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`,
        'g'
      );

      content = content.replace(categoryRegex, "category: 'Uncategorized'");
    }

    // Write back to file
    await writeFileContent(
      roadmapPath,
      content,
      `Delete category: ${category} from ${type} roadmap [via admin]`
    );

    const requiresRebuild = isGitHubConfigured();

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      requiresRebuild
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}

// PATCH: Rename a category
export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { oldCategory, newCategory, type } = await request.json();

    if (!oldCategory || !newCategory || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Read the roadmap file
    const roadmapPath = 'lib/roadmap.ts';
    let content = await readFileContent(roadmapPath);

    // Replace all occurrences of the old category with the new one
    const categoryRegex = new RegExp(
      `category:\\s*'${oldCategory.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`,
      'g'
    );

    content = content.replace(categoryRegex, `category: '${newCategory}'`);

    // Write back to file
    await writeFileContent(
      roadmapPath,
      content,
      `Rename category: ${oldCategory} → ${newCategory} in ${type} roadmap [via admin]`
    );

    const requiresRebuild = isGitHubConfigured();

    return NextResponse.json({
      success: true,
      message: 'Category renamed successfully',
      requiresRebuild
    });
  } catch (error) {
    console.error('Rename error:', error);
    return NextResponse.json(
      { error: 'Failed to rename category' },
      { status: 500 }
    );
  }
}
