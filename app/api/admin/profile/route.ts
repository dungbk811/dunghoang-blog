import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { readFileContent, writeFileContent, isGitHubConfigured } from '@/lib/github';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();

    if (!updates) {
      return NextResponse.json(
        { error: 'Missing profile data' },
        { status: 400 }
      );
    }

    // Read the profile file
    const profilePath = 'lib/profile.ts';
    let content = await readFileContent(profilePath);

    // Update name
    if (updates.name !== undefined) {
      content = content.replace(
        /name:\s*'[^']*'/,
        `name: '${updates.name.replace(/'/g, "\\'")}'`
      );
    }

    // Update position
    if (updates.position !== undefined) {
      content = content.replace(
        /position:\s*'[^']*'/,
        `position: '${updates.position.replace(/'/g, "\\'")}'`
      );
    }

    // Update phone
    if (updates.phone !== undefined) {
      content = content.replace(
        /phone:\s*'[^']*'/,
        `phone: '${updates.phone.replace(/'/g, "\\'")}'`
      );
    }

    // Update email
    if (updates.email !== undefined) {
      content = content.replace(
        /email:\s*'[^']*'/,
        `email: '${updates.email.replace(/'/g, "\\'")}'`
      );
    }

    // Update linkedin
    if (updates.linkedin !== undefined) {
      content = content.replace(
        /linkedin:\s*'[^']*'/,
        `linkedin: '${updates.linkedin.replace(/'/g, "\\'")}'`
      );
    }

    // Write to GitHub or local file
    await writeFileContent(
      profilePath,
      content,
      `Update user profile [via admin]`
    );

    const requiresRebuild = isGitHubConfigured();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      requiresRebuild
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
