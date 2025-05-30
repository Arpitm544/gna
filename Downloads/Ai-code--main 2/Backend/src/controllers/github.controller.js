const githubService = require('../services/github.service');

const pushToGitHub = async (req, res) => {
  try {
    const { code, projectName, repoUrl, branch = 'main' } = req.body;

    if (!code || !projectName || !repoUrl) {
      return res.status(400).json({ message: 'Missing required fields: code, projectName, or repoUrl.' });
    }

    if (!process.env.GITHUB_TOKEN) {
      return res.status(500).json({
        success: false,
        message: 'GitHub token is not configured'
      });
    }

    // Clean repository URL
    let cleanRepoUrl = repoUrl.trim();
    if (cleanRepoUrl.endsWith('.git')) {
      cleanRepoUrl = cleanRepoUrl.slice(0, -4);
    }
    if (!cleanRepoUrl.startsWith('https://github.com/')) {
      cleanRepoUrl = `https://github.com/${cleanRepoUrl}`;
    }

    const result = await githubService.pushToGitHub({
      code,
      projectName,
      repoUrl: cleanRepoUrl,
      branch
    });

    if (result.success) {
      res.status(200).json({ message: result.message, url: result.url, branch: result.branch });
    } else {
      let statusCode = 500;
      if (result.status) {
        statusCode = result.status;
      } else if (result.message.includes('token') || result.message.includes('permissions')) {
        statusCode = 401;
      } else if (result.message.includes('repository not found')) {
        statusCode = 404;
      } else if (result.message.includes('URL') || result.message.includes('format')) {
        statusCode = 400;
      }
      res.status(statusCode).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error in pushToGitHub controller:', error);
    res.status(500).json({ message: error.message || 'An unexpected error occurred during GitHub push.' });
  }
};

module.exports = {
  pushToGitHub
}; 