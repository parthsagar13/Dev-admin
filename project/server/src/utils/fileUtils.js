import fs from 'fs/promises';
import path from 'path';

export const findIndexHtml = async (rootDir) => {
  const candidates = [];

  const walk = async (dir, depth = 0) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (['node_modules', '.git', '__MACOSX'].includes(entry.name)) continue;
        await walk(fullPath, depth + 1);
      } else if (entry.name.toLowerCase() === 'index.html') {
        const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
        candidates.push({ fullPath, relativePath, depth });
      }
    }
  };

  await walk(rootDir);
  if (candidates.length === 0) {
    throw new Error('No index.html found in the uploaded ZIP');
  }

  candidates.sort((a, b) => {
    if (a.depth !== b.depth) return a.depth - b.depth;
    const aScore = scorePath(a.relativePath);
    const bScore = scorePath(b.relativePath);
    return bScore - aScore;
  });

  return candidates[0];
};

const scorePath = (relativePath) => {
  let score = 0;
  const lower = relativePath.toLowerCase();
  if (lower === 'index.html') score += 100;
  if (lower.startsWith('dist/') || lower.startsWith('build/') || lower.startsWith('public/')) score += 50;
  if (lower.includes('node_modules') || lower.includes('vendor')) score -= 100;
  const segments = relativePath.split('/');
  score -= segments.length;
  return score;
};

export const pickBestIndexPath = (relativePaths) => {
  if (!relativePaths.length) return null;

  const candidates = relativePaths.map((relativePath) => ({
    relativePath,
    depth: relativePath.split('/').length - 1,
  }));

  candidates.sort((a, b) => {
    if (a.depth !== b.depth) return a.depth - b.depth;
    return scorePath(b.relativePath) - scorePath(a.relativePath);
  });

  return candidates[0].relativePath;
};

const PREVIEW_NAMES = ['preview.jpg', 'preview.jpeg', 'preview.png', 'preview.webp'];

export const findPreviewImage = async (rootDir) => {
  const found = [];

  const walk = async (dir) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (['node_modules', '.git', '__MACOSX'].includes(entry.name)) continue;
        await walk(fullPath);
      } else if (PREVIEW_NAMES.includes(entry.name.toLowerCase())) {
        found.push(fullPath);
      }
    }
  };

  await walk(rootDir);
  return found[0] || null;
};

export const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html',
    '.htm': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.map': 'application/json',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
  };
  return map[ext] || 'application/octet-stream';
};
