import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import unzipper from 'unzipper';
import { createReadStream } from 'fs';
import { storageService } from './storage/storage.service.ts';
import { findIndexHtml, findPreviewImage } from '../utils/fileUtils.js';

const buildPreviewUrl = (slug) => {
  const base = process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${base.replace(/\/$/, '')}/api/preview/${slug}`;
};

const extractZipToDir = async (zipBuffer, extractDir) => {
  const zipPath = path.join(path.dirname(extractDir), 'preview.zip');
  await fs.writeFile(zipPath, zipBuffer);
  await fs.mkdir(extractDir, { recursive: true });

  await new Promise((resolve, reject) => {
    createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractDir }))
      .on('close', resolve)
      .on('error', reject);
  });

  await fs.rm(zipPath, { force: true });
};

const writePreviewFilesToDir = async (files, extractDir) => {
  await fs.mkdir(extractDir, { recursive: true });

  for (const file of files) {
    const relativePath = file.relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
    const dest = path.join(extractDir, relativePath);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, file.buffer);
  }
};

const processPreviewDir = async (extractDir, slug, sourceBuffer, customThumbnail) => {
  const indexCandidate = await findIndexHtml(extractDir);
  const previewImagePath = await findPreviewImage(extractDir);

  const sourceZipUrl = await storageService.uploadZip(slug, sourceBuffer);
  const zipPath = `source/${slug}.zip`;
  await storageService.uploadPreview(slug, extractDir);

  const previewUrl = buildPreviewUrl(slug);
  const previewIndexPath = indexCandidate.relativePath;

  let thumbnailUrl;
  if (customThumbnail) {
    thumbnailUrl = await storageService.uploadThumbnailBuffer(
      slug,
      customThumbnail.buffer,
      customThumbnail.mimeType
    );
  } else if (previewImagePath) {
    thumbnailUrl = await storageService.uploadThumbnail(slug, previewImagePath);
  } else {
    thumbnailUrl = await storageService.uploadDefaultThumbnail(slug);
  }

  return { sourceZipUrl, zipPath, previewUrl, previewIndexPath, thumbnailUrl };
};

export const processTemplateUpload = async (sourceBuffer, previewInput, slug, customThumbnail) => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codemarket-'));
  const extractDir = path.join(tempDir, 'extracted');

  try {
    if (previewInput.type === 'zip') {
      await extractZipToDir(previewInput.buffer, extractDir);
    } else {
      await writePreviewFilesToDir(previewInput.files, extractDir);
    }

    return await processPreviewDir(extractDir, slug, sourceBuffer, customThumbnail);
  } catch (err) {
    await storageService.deleteFiles(slug).catch(() => {});
    throw err;
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
};
