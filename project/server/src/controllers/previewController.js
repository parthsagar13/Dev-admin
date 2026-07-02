import { Template } from '../models/Template.js';
import { storageService } from '../services/storage/storage.service.ts';
import { getContentType } from '../utils/fileUtils.js';
import path from 'path';

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

export const servePreview = async (req, res, next) => {
  try {
    const match = req.path.match(/^\/api\/preview\/([^/]+)(?:\/(.*))?$/);
    if (!match) return res.status(404).send('Not found');

    const slug = match[1];
    const requestedPath = match[2] ? decodeURIComponent(match[2]) : '';

    const template = await Template.findOne({ slug });
    if (!template) return res.status(404).send('Template not found');

    const indexPath = await resolveIndexPath(template);
    const { buffer, storagePath } = await storageService.downloadPreviewFile(
      slug,
      requestedPath,
      indexPath
    );

    const contentType = getContentType(storagePath);
    const relativePath = storagePath.replace(`preview/${slug}/`, '');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Security-Policy', 'frame-ancestors *');
    res.removeHeader('X-Frame-Options');

    if (contentType === 'text/html') {
      const baseHref = buildBaseHref(slug, relativePath);
      const html = injectBaseHref(buffer.toString('utf-8'), baseHref);
      return res.send(html);
    }

    res.send(buffer);
  } catch (err) {
    if (err instanceof Error && err.message.includes('not found')) {
      return res.status(404).send('Preview page not found.');
    }
    next(err);
  }
};
