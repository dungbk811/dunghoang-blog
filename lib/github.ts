import { Octokit } from '@octokit/rest';

// Initialize Octokit with GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.GITHUB_OWNER || 'dungbk811';
const repo = process.env.GITHUB_REPO || 'dunghoang-blog';
const branch = process.env.GITHUB_BRANCH || 'main';

/**
 * Commit a file to GitHub repository
 * @param path - File path in repo (e.g., 'lib/roadmap.ts')
 * @param content - File content
 * @param message - Commit message
 */
export async function commitFile(
  path: string,
  content: string,
  message: string
): Promise<void> {
  try {
    // Get current file SHA (needed for updates)
    let sha: string | undefined;
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });

      if ('sha' in data) {
        sha = data.sha;
      }
    } catch (error) {
      // File doesn't exist yet, that's ok
      console.log('File does not exist yet, will create new file');
    }

    // Commit the file
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      sha, // Include SHA if updating existing file
      branch,
    });

    console.log(`✓ Successfully committed ${path} to GitHub`);
  } catch (error) {
    console.error('Error committing to GitHub:', error);
    throw new Error(`Failed to commit file to GitHub: ${error}`);
  }
}

/**
 * Read a file from GitHub repository
 * @param path - File path in repo
 * @returns File content as string
 */
export async function readFile(path: string): Promise<string> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    if ('content' in data) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }

    throw new Error('File content not found');
  } catch (error) {
    console.error('Error reading from GitHub:', error);
    throw new Error(`Failed to read file from GitHub: ${error}`);
  }
}

/**
 * Check if GitHub integration is configured
 */
export function isGitHubConfigured(): boolean {
  return !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
}
