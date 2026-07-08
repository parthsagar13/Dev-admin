import { Template } from '../models/Template.js';
import { storageService } from '../services/storage/storage.service.ts';
import { getContentType } from '../utils/fileUtils.js';
import path from 'path';
import crypto from 'crypto';

const injectBaseHref = (html, baseHref) => {
  if (/<base\s/i.test(html)) return html;
  const baseTag = `<base href="${baseHref}">`;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (match) => `${match}${baseTag}`);
  }
  return `<head>${baseTag}</head>${html}`;
};

const resolveIndexPath = async (template) => {
  if (template.previewIndexPath) {
    return template.previewIndexPath;
  }

  const discovered = await storageService.findStoredIndexPath(template.slug);
  if (discovered) {
    template.previewIndexPath = discovered;
    await template.save();
    return discovered;
  }

  return 'index.html';
};

const buildBaseHref = (slug, relativePath) => {
  const currentDir = path.posix.dirname(relativePath);
  return currentDir && currentDir !== '.'
    ? `/api/preview/${slug}/${currentDir}/`
    : `/api/preview/${slug}/`;
};

const TEMPLATE_CACHE_TTL_MS = 5 * 60 * 1000;
const ASSET_CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_CACHE_ENTRIES = 200;

const templateCache = new Map(); // slug -> { template, expiresAt }
const assetCache = new Map(); // key -> { buffer, contentType, etag, expiresAt }

const pruneCache = () => {
  const now = Date.now();

  for (const [k, v] of templateCache.entries()) {
    if (v.expiresAt <= now) templateCache.delete(k);
  }
  for (const [k, v] of assetCache.entries()) {
    if (v.expiresAt <= now) assetCache.delete(k);
  }
  while (assetCache.size > MAX_CACHE_ENTRIES) {
    const firstKey = assetCache.keys().next().value;
    assetCache.delete(firstKey);
  }
};

const getCachedTemplate = async (slug) => {
  pruneCache();
  const cached = templateCache.get(slug);
  if (cached?.expiresAt > Date.now()) return cached.template;

  const template = await Template.findOne({ slug });
  if (!template) return null;
  templateCache.set(slug, { template, expiresAt: Date.now() + TEMPLATE_CACHE_TTL_MS });
  return template;
};

export const servePreview = async (req, res, next) => {
  try {
    const match = req.path.match(/^\/api\/preview\/([^/]+)(?:\/(.*))?$/);
    if (!match) return res.status(404).send('Not found');

    const slug = match[1];
    const requestedPath = match[2] ? decodeURIComponent(match[2]) : '';

    const template = await getCachedTemplate(slug);
    if (!template) return res.status(404).send('Template not found');

    const indexPath = await resolveIndexPath(template);
    const cacheKey = `${slug}:${requestedPath || '__index__'}:${indexPath}`;
    const cachedAsset = assetCache.get(cacheKey);

    let buffer;
    let storagePath;
    let contentType;
    let etag;
    let relativePath;

    if (cachedAsset?.expiresAt > Date.now()) {
      ({ buffer, contentType, etag } = cachedAsset);
      storagePath = cachedAsset.storagePath;
      relativePath = cachedAsset.relativePath;
    } else {
      const dl = await storageService.downloadPreviewFile(slug, requestedPath, indexPath);
      buffer = dl.buffer;
      storagePath = dl.storagePath;
      contentType = getContentType(storagePath);
      relativePath = storagePath.replace(`preview/${slug}/`, '');
      etag = `"${crypto.createHash('sha1').update(buffer).digest('hex')}"`;

      // Cache non-HTML assets (HTML base injection varies by request path)
      if (contentType !== 'text/html') {
        assetCache.set(cacheKey, {
          buffer,
          contentType,
          etag,
          storagePath,
          relativePath,
          expiresAt: Date.now() + ASSET_CACHE_TTL_MS,
        });
      }
    }

    res.setHeader('Content-Type', contentType);
    if (etag) res.setHeader('ETag', etag);
    res.setHeader('Content-Security-Policy', 'frame-ancestors *');
    res.removeHeader('X-Frame-Options');

    const ifNoneMatch = req.headers['if-none-match'];
    if (etag && ifNoneMatch && ifNoneMatch === etag) {
      res.status(304);
      return res.end();
    }

    if (contentType === 'text/html') {
      const baseHref = buildBaseHref(slug, relativePath);
      const html = injectBaseHref(buffer.toString('utf-8'), baseHref);
      // HTML should not be cached aggressively because base href can vary by route
      res.setHeader('Cache-Control', 'no-store');
      return res.send(html);
    }

    // Long cache for static preview assets (browser + CDN friendly). They are content-addressed by path.
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  } catch (err) {
    if (err instanceof Error && err.message.includes('not found')) {
      return res.status(404).send('Preview page not found.');
    }
    next(err);
  }
};
