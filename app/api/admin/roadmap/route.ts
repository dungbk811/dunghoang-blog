import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { readFileContent, writeFileContent, isGitHubConfigured } from '@/lib/github';
import fs from 'fs/promises';
import path from 'path';

// Helper function to generate unique ID
function generateId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId, type, updates } = await request.json();

    if (!itemId || !type || !updates) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Read the roadmap file
    const roadmapPath = 'lib/roadmap.ts';
    let content = await readFileContent(roadmapPath);

    // Find the item by ID and update its properties
    const itemRegex = new RegExp(
      `(\\{[^}]*id:\\s*'${itemId}'[^}]*\\})`,
      'gs'
    );

    const match = content.match(itemRegex);
    if (!match) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    let itemBlock = match[0];

    // Update category
    if (updates.category) {
      itemBlock = itemBlock.replace(
        /category:\s*'[^']*'/,
        `category: '${updates.category}'`
      );
    }

    // Update subcategory
    if (updates.subcategory !== undefined) {
      if (itemBlock.includes('subcategory:')) {
        if (updates.subcategory === '') {
          // Remove subcategory if empty
          itemBlock = itemBlock.replace(/,?\s*subcategory:\s*'[^']*',?/, '');
        } else {
          itemBlock = itemBlock.replace(
            /subcategory:\s*'[^']*'/,
            `subcategory: '${updates.subcategory}'`
          );
        }
      } else if (updates.subcategory) {
        // Add subcategory if it doesn't exist
        itemBlock = itemBlock.replace(
          /category:\s*'[^']*',/,
          `category: '${updates.category || 'Unknown'}',\n    subcategory: '${updates.subcategory}',`
        );
      }
    }

    // Update status
    if (updates.status) {
      itemBlock = itemBlock.replace(
        /status:\s*'[^']*'/,
        `status: '${updates.status}'`
      );
    }

    // Update priority
    if (updates.priority) {
      if (itemBlock.includes('priority:')) {
        itemBlock = itemBlock.replace(
          /priority:\s*'[^']*'/,
          `priority: '${updates.priority}'`
        );
      } else {
        // Add priority field if it doesn't exist
        itemBlock = itemBlock.replace(
          /status:\s*'[^']*',/,
          `status: '${updates.status || 'planned'}',\n    priority: '${updates.priority}',`
        );
      }
    }

    // Update startDate
    if (updates.startDate) {
      if (itemBlock.includes('startDate:')) {
        itemBlock = itemBlock.replace(
          /startDate:\s*'[^']*'/,
          `startDate: '${updates.startDate}'`
        );
      } else {
        itemBlock = itemBlock.replace(
          /priority:\s*'[^']*',/,
          `priority: '${updates.priority || 'medium'}',\n    startDate: '${updates.startDate}',`
        );
      }
    }

    // Update targetDate
    if (updates.targetDate) {
      if (itemBlock.includes('targetDate:')) {
        itemBlock = itemBlock.replace(
          /targetDate:\s*'[^']*'/,
          `targetDate: '${updates.targetDate}'`
        );
      } else {
        const insertAfter = updates.startDate ? 'startDate' : 'priority';
        const insertValue = updates.startDate || updates.priority || 'medium';
        itemBlock = itemBlock.replace(
          new RegExp(`${insertAfter}:\\s*'[^']*',`),
          `${insertAfter}: '${insertValue}',\n    targetDate: '${updates.targetDate}',`
        );
      }
    }

    // Update level
    if (updates.level) {
      if (itemBlock.includes('level:')) {
        itemBlock = itemBlock.replace(
          /level:\s*'[^']*'/,
          `level: '${updates.level}'`
        );
      } else {
        // Add level field after status
        itemBlock = itemBlock.replace(
          /status:\s*'[^']*',/,
          `status: '${updates.status || 'planned'}',\n    level: '${updates.level}',`
        );
      }
    }

    // Update hidden
    if (updates.hidden !== undefined) {
      if (itemBlock.includes('hidden:')) {
        itemBlock = itemBlock.replace(
          /hidden:\s*(true|false)/,
          `hidden: ${updates.hidden}`
        );
      } else {
        // Add hidden field after level or status
        const insertAfter = updates.level ? 'level' : 'status';
        const insertValue = updates.level || updates.status || 'planned';
        itemBlock = itemBlock.replace(
          new RegExp(`${insertAfter}:\\\\s*'[^']*',`),
          `${insertAfter}: '${insertValue}',\n    hidden: ${updates.hidden},`
        );
      }
    }

    // Update relatedWorkIds (for Learning items)
    if (updates.relatedWorkIds !== undefined) {
      if (itemBlock.includes('relatedWorkIds:')) {
        if (updates.relatedWorkIds.length === 0) {
          // Remove relatedWorkIds if empty
          itemBlock = itemBlock.replace(/,?\s*relatedWorkIds:\s*\[[^\]]*\],?/, '');
        } else {
          itemBlock = itemBlock.replace(
            /relatedWorkIds:\s*\[[^\]]*\]/,
            `relatedWorkIds: [${updates.relatedWorkIds.map((id: string) => `'${id}'`).join(', ')}]`
          );
        }
      } else if (updates.relatedWorkIds.length > 0) {
        // Add relatedWorkIds after tags if exists, otherwise after hidden
        if (itemBlock.includes('tags:')) {
          itemBlock = itemBlock.replace(
            /tags:\s*\[[^\]]*\],/,
            `$&\n    relatedWorkIds: [${updates.relatedWorkIds.map((id: string) => `'${id}'`).join(', ')}],`
          );
        } else {
          itemBlock = itemBlock.replace(
            /hidden:\s*(true|false),/,
            `$&\n    relatedWorkIds: [${updates.relatedWorkIds.map((id: string) => `'${id}'`).join(', ')}],`
          );
        }
      }
    }

    // Update relatedLearningIds (for COO items)
    if (updates.relatedLearningIds !== undefined) {
      if (itemBlock.includes('relatedLearningIds:')) {
        if (updates.relatedLearningIds.length === 0) {
          // Remove relatedLearningIds if empty
          itemBlock = itemBlock.replace(/,?\s*relatedLearningIds:\s*\[[^\]]*\],?/, '');
        } else {
          itemBlock = itemBlock.replace(
            /relatedLearningIds:\s*\[[^\]]*\]/,
            `relatedLearningIds: [${updates.relatedLearningIds.map((id: string) => `'${id}'`).join(', ')}]`
          );
        }
      } else if (updates.relatedLearningIds.length > 0) {
        // Add relatedLearningIds after tags if exists, otherwise after hidden
        if (itemBlock.includes('tags:')) {
          itemBlock = itemBlock.replace(
            /tags:\s*\[[^\]]*\],/,
            `$&\n    relatedLearningIds: [${updates.relatedLearningIds.map((id: string) => `'${id}'`).join(', ')}],`
          );
        } else {
          itemBlock = itemBlock.replace(
            /hidden:\s*(true|false),/,
            `$&\n    relatedLearningIds: [${updates.relatedLearningIds.map((id: string) => `'${id}'`).join(', ')}],`
          );
        }
      }
    }

    // Replace the old item block with the updated one
    content = content.replace(match[0], itemBlock);

    // Write to GitHub or local file
    await writeFileContent(
      roadmapPath,
      content,
      `Update roadmap item: ${itemId} [via admin]`
    );

    const requiresRebuild = isGitHubConfigured();

    return NextResponse.json({
      success: true,
      message: 'Item updated successfully',
      requiresRebuild
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, item } = await request.json();

    if (!type || !item || !item.title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique ID
    const newItem = {
      id: generateId(),
      title: item.title,
      description: item.description || '',
      category: item.category || 'Uncategorized',
      status: item.status || 'planned',
      level: item.level || 'beginner',
      hidden: item.hidden !== undefined ? item.hidden : true,
      ...(item.subcategory && { subcategory: item.subcategory }),
      ...(item.priority && { priority: item.priority }),
      ...(item.startDate && { startDate: item.startDate }),
      ...(item.targetDate && { targetDate: item.targetDate }),
      ...(item.tags && item.tags.length > 0 && { tags: item.tags }),
      ...(item.relatedWorkIds && item.relatedWorkIds.length > 0 && { relatedWorkIds: item.relatedWorkIds }),
      ...(item.relatedLearningIds && item.relatedLearningIds.length > 0 && { relatedLearningIds: item.relatedLearningIds }),
    };

    // Read the roadmap file
    const roadmapPath = 'lib/roadmap.ts';
    let content = await readFileContent(roadmapPath);

    // Find the appropriate array based on type
    const arrayName = type === 'learning' ? 'learningRoadmap' : 'cooRoadmap';
    const arrayRegex = new RegExp(
      `(export const ${arrayName}: RoadmapItem\\[\\] = \\[)([\\s\\S]*?)(\\n\\];)`,
      'm'
    );

    const match = content.match(arrayRegex);
    if (!match) {
      return NextResponse.json({ error: 'Roadmap array not found' }, { status: 404 });
    }

    // Format new item
    let newItemStr = `  {\n`;
    newItemStr += `    id: '${newItem.id}',\n`;
    newItemStr += `    title: '${newItem.title.replace(/'/g, "\\'")}',\n`;
    newItemStr += `    description: '${newItem.description.replace(/'/g, "\\'")}',\n`;
    newItemStr += `    category: '${newItem.category}',\n`;
    if (newItem.subcategory) {
      newItemStr += `    subcategory: '${newItem.subcategory}',\n`;
    }
    newItemStr += `    status: '${newItem.status}',\n`;
    newItemStr += `    level: '${newItem.level}',\n`;
    newItemStr += `    hidden: ${newItem.hidden},\n`;
    if (newItem.priority) {
      newItemStr += `    priority: '${newItem.priority}',\n`;
    }
    if (newItem.startDate) {
      newItemStr += `    startDate: '${newItem.startDate}',\n`;
    }
    if (newItem.targetDate) {
      newItemStr += `    targetDate: '${newItem.targetDate}',\n`;
    }
    if (newItem.tags && newItem.tags.length > 0) {
      newItemStr += `    tags: [${newItem.tags.map((tag: string) => `'${tag}'`).join(', ')}],\n`;
    }
    if (newItem.relatedWorkIds && newItem.relatedWorkIds.length > 0) {
      newItemStr += `    relatedWorkIds: [${newItem.relatedWorkIds.map((id: string) => `'${id}'`).join(', ')}],\n`;
    }
    if (newItem.relatedLearningIds && newItem.relatedLearningIds.length > 0) {
      newItemStr += `    relatedLearningIds: [${newItem.relatedLearningIds.map((id: string) => `'${id}'`).join(', ')}],\n`;
    }
    newItemStr += `  },`;

    // Add new item to the end of the array (before the closing bracket)
    const replacement = `${match[1]}${match[2]}\n${newItemStr}${match[3]}`;
    content = content.replace(arrayRegex, replacement);

    // Write to GitHub or local file
    await writeFileContent(
      roadmapPath,
      content,
      `Add new ${type} item: ${newItem.title} [via admin]`
    );

    const requiresRebuild = isGitHubConfigured();

    return NextResponse.json({
      success: true,
      message: 'Item added successfully',
      item: newItem,
      requiresRebuild
    });
  } catch (error) {
    console.error('Create error:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const type = searchParams.get('type');

    if (!itemId || !type) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Read the roadmap file
    const roadmapPath = 'lib/roadmap.ts';
    let content = await readFileContent(roadmapPath);

    // Find and remove the item
    const itemRegex = new RegExp(
      `\\s*\\{[^}]*id:\\s*'${itemId}'[^}]*\\},?\\n?`,
      'gs'
    );

    const match = content.match(itemRegex);
    if (!match) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Remove the item
    content = content.replace(itemRegex, '');

    // Clean up relationships: Remove this itemId from any related items
    if (type === 'learning') {
      // If deleting a Learning item, remove its ID from COO items' relatedLearningIds
      const relatedLearningRegex = new RegExp(
        `(relatedLearningIds:\\s*\\[)([^\\]]*)\\]`,
        'g'
      );
      content = content.replace(relatedLearningRegex, (match, prefix, ids) => {
        // Remove the deleted itemId from the array
        const cleanedIds = ids
          .split(',')
          .map((id: string) => id.trim())
          .filter((id: string) => id && !id.includes(itemId))
          .join(', ');

        // If array is empty after removal, remove the entire field
        if (!cleanedIds) {
          return '';
        }
        return `${prefix}${cleanedIds}]`;
      });

      // Clean up any trailing commas or empty relatedLearningIds lines
      content = content.replace(/,?\s*relatedLearningIds:\s*\[\s*\],?/g, '');
    } else if (type === 'coo') {
      // If deleting a COO item, remove its ID from Learning items' relatedWorkIds
      const relatedWorkRegex = new RegExp(
        `(relatedWorkIds:\\s*\\[)([^\\]]*)\\]`,
        'g'
      );
      content = content.replace(relatedWorkRegex, (match, prefix, ids) => {
        // Remove the deleted itemId from the array
        const cleanedIds = ids
          .split(',')
          .map((id: string) => id.trim())
          .filter((id: string) => id && !id.includes(itemId))
          .join(', ');

        // If array is empty after removal, remove the entire field
        if (!cleanedIds) {
          return '';
        }
        return `${prefix}${cleanedIds}]`;
      });

      // Clean up any trailing commas or empty relatedWorkIds lines
      content = content.replace(/,?\s*relatedWorkIds:\s*\[\s*\],?/g, '');
    }

    // Write to GitHub or local file
    await writeFileContent(
      roadmapPath,
      content,
      `Delete roadmap item: ${itemId} [via admin]`
    );

    const requiresRebuild = isGitHubConfigured();

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully',
      requiresRebuild
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
