const { Octokit } = require('@octokit/rest');
const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');
const os = require('os');

class GitHubService {
  constructor() {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GitHub token is not configured');
    }
    
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  }

  async verifyTokenPermissions() {
    try {
      const response = await this.octokit.request('GET /user', { headers: { authorization: `token ${process.env.GITHUB_TOKEN}` } });
      const scopes = response.headers['x-oauth-scopes'] ? response.headers['x-oauth-scopes'].split(', ') : [];

      if (!scopes.includes('repo') && !scopes.includes('workflow')) {
        throw new Error('GitHub token is missing required permissions (repo or workflow scope). Please generate a new token with these permissions.');
      }

      return true;
    } catch (error) {
      throw new Error('Invalid GitHub token or insufficient permissions');
    }
  }

  async createRepository(owner, repo, projectName) {
    try {
      await this.octokit.repos.get({ owner, repo });
      console.log(`Repository ${owner}/${repo} already exists.`);
      return { success: true, message: 'Repository already exists.' };
    } catch (error) {
      if (error.status === 404) {
        console.log(`Repository ${owner}/${repo} not found. Creating...`);
        const response = await this.octokit.repos.createForAuthenticatedUser({
          name: repo,
          private: true,
          auto_init: false,
        });
        if (response.status !== 201) {
          throw new Error(`Failed to create repository: Status ${response.status}`);
        }
        console.log(`Repository ${owner}/${repo} created successfully.`);
        return { success: true, message: 'Repository created successfully.', url: response.data.html_url };
      } else {
        throw new Error(`Error checking or creating repository: ${error.message}`);
      }
    }
  }

  async pushToGitHub({ code, projectName, repoUrl, branch = 'main' }) {
    let tempDir;
    try {
      await this.verifyTokenPermissions();

      // Clean and validate repository URL
      repoUrl = repoUrl.replace(/\.git$/, '').trim();
      if (!repoUrl.startsWith('https://github.com/')) {
        repoUrl = `https://github.com/${repoUrl}`;
      }

      const [owner, repo] = repoUrl.split('github.com/')[1].split('/');
      if (!owner || !repo) {
        throw new Error('Invalid repository URL format');
      }

      // Create temporary directory and initialize git
      tempDir = path.join(os.tmpdir(), `codepilot-${Date.now()}`);
      fs.mkdirSync(tempDir);
      const git = simpleGit(tempDir);
      await git.init();

      // Create and commit file
      const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}.js`;
      fs.writeFileSync(path.join(tempDir, fileName), code);
      await git.add(fileName);
      await git.commit('Initial commit from CodePilot');

      // Create repository and push
      await this.createRepository(owner, repo, projectName);
      const token = process.env.GITHUB_TOKEN;
      const remoteUrl = `https://${token}@github.com/${owner}/${repo}.git`;
      
      await git.addRemote('origin', remoteUrl);
      await git.checkoutLocalBranch(branch);
      await git.push('origin', branch, ['--force']);

      return {
        success: true,
        message: 'Successfully pushed to GitHub',
        url: `https://github.com/${owner}/${repo}`,
        branch
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to push to GitHub');
    } finally {
      if (tempDir && fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  }
}

module.exports = new GitHubService(); 