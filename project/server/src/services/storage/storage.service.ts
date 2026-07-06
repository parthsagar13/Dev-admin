import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getContentType, pickBestIndexPath } from '../../utils/fileUtils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PLACEHOLDER_PATH = path.join(__dirname, '../../assets/placeholder.svg');

const SKIP_DIRS = new Set(['node_modules', '.git', '__MACOSX', '.svn', '.hg', 'vendor', '.next', '.cache']);
const UPLOAD_CONCURRENCY = 4;
const MAX_RETRIES = 4;
const MAX_FILE_BYTES = 50 * 1024 * 1024;

const RETRYABLE = /bad gateway|timeout|429|502|503|504|econnreset|fetch failed|network/i;

class StorageService {
  private client: SupabaseClient;
  private bucket: string;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
    }
    this.bucket = process.env.SUPABASE_BUCKET || 'templates';
    this.client = createClient(this.normalizeSupabaseUrl(url), key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  private normalizeSupabaseUrl(url: string): string {
    return url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  }

  private sanitizePath(storagePath: string): string {
    return storagePath.replace(/^\/+/, '').replace(/\/+/g, '/');
  }

  getPublicUrl(storagePath: string): string {
    const { data } = this.client.storage.from(this.bucket).getPublicUrl(this.sanitizePath(storagePath));
    return data.publicUrl;
  }

  async createSignedUrl(storagePath: string, expiresInSeconds = 600): Promise<string> {
    const objectPath = this.sanitizePath(storagePath);
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(objectPath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      throw new Error(`Failed to generate signed URL: ${error?.message || 'unknown error'}`);
    }

    return data.signedUrl;
  }

  private async uploadOnce(storagePath: string, buffer: Buffer, contentType: string): Promise<void> {
    const objectPath = this.sanitizePath(storagePath);
    const { error } = await this.client.storage.from(this.bucket).upload(objectPath, buffer, {
      contentType,
      upsert: true,
    });
    if (error) throw new Error(`Storage upload failed: ${error.message}`);
  }

  private async upload(storagePath: string, buffer: Buffer, contentType: string): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        await this.uploadOnce(storagePath, buffer, contentType);
        return;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        const retryable = RETRYABLE.test(lastError.message);
        if (!retryable || attempt === MAX_RETRIES) throw lastError;
        await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt));
      }
    }

    throw lastError ?? new Error('Storage upload failed');
  }

  async downloadFile(storagePath: string): Promise<Buffer> {
    const objectPath = this.sanitizePath(storagePath);
    const { data, error } = await this.client.storage.from(this.bucket).download(objectPath);
    if (error || !data) throw new Error(`Storage file not found: ${objectPath}`);
    return Buffer.from(await data.arrayBuffer());
  }

  private buildPreviewCandidates(slug: string, requestedPath: string, indexPath: string): string[] {
    const base = `preview/${slug}`;

    if (!requestedPath) {
      return [`${base}/${indexPath}`];
    }

    const clean = requestedPath.replace(/^\/+/, '').replace(/\/+$/, '');
    const candidates = [`${base}/${clean}`];
    const hasExtension = /\.[a-z0-9]+$/i.test(path.posix.basename(clean));

    if (!hasExtension) {
      candidates.push(`${base}/${clean}.html`);
      candidates.push(`${base}/${clean}.htm`);
      candidates.push(`${base}/${clean}/index.html`);
      candidates.push(`${base}/${clean}/index.htm`);
    }

    return candidates;
  }

  async downloadPreviewFile(
    slug: string,
    requestedPath: string,
    indexPath: string
  ): Promise<{ buffer: Buffer; storagePath: string }> {
    const candidates = this.buildPreviewCandidates(slug, requestedPath, indexPath);

    for (const storagePath of candidates) {
      try {
        const buffer = await this.downloadFile(storagePath);
        return { buffer, storagePath };
      } catch {
        continue;
      }
    }

    const clean = requestedPath.replace(/^\/+/, '').replace(/\/+$/, '');
    const looksLikePage = clean && !/\.[a-z0-9]+$/i.test(path.posix.basename(clean));
    if (looksLikePage) {
      const buffer = await this.downloadFile(`preview/${slug}/${indexPath}`);
      return { buffer, storagePath: `preview/${slug}/${indexPath}` };
    }

    throw new Error(`Storage file not found: preview/${slug}/${clean || indexPath}`);
  }

  async uploadThumbnailBuffer(slug: string, buffer: Buffer, mimeType: string): Promise<string> {
    const extMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    };
    const ext = extMap[mimeType] || '.jpg';
    const storagePath = `thumbnail/${slug}${ext}`;
    await this.upload(storagePath, buffer, mimeType);
    return this.getPublicUrl(storagePath);
  }

  async findStoredIndexPath(slug: string): Promise<string | null> {
    const files = await this.listAllFiles(`preview/${slug}`);
    const relativePaths = files
      .filter((file) => {
        const lower = file.toLowerCase();
        return lower.endsWith('/index.html') || lower.endsWith('/index.htm');
      })
      .map((file) => file.replace(`preview/${slug}/`, ''));

    return pickBestIndexPath(relativePaths);
  }

  async uploadZip(slug: string, buffer: Buffer): Promise<string> {
    const storagePath = `source/${slug}.zip`;
    await this.upload(storagePath, buffer, 'application/zip');
    return this.getPublicUrl(storagePath);
  }

  async uploadPreview(slug: string, extractDir: string): Promise<{ basePath: string }> {
    const basePath = `preview/${slug}`;
    const files = await this.collectFiles(extractDir, basePath, '');

    await this.runPool(files, UPLOAD_CONCURRENCY, async ({ storagePath, localPath }) => {
      const stat = await fs.stat(localPath);
      if (stat.size > MAX_FILE_BYTES) return;

      const buffer = await fs.readFile(localPath);
      await this.upload(storagePath, buffer, getContentType(localPath));
    });

    return { basePath };
  }

  async uploadThumbnail(slug: string, localFilePath: string): Promise<string> {
    const ext = path.extname(localFilePath).toLowerCase() || '.png';
    const storagePath = `thumbnail/${slug}${ext}`;
    const buffer = await fs.readFile(localFilePath);
    const contentType = getContentType(localFilePath);
    await this.upload(storagePath, buffer, contentType);
    return this.getPublicUrl(storagePath);
  }

  async uploadDefaultThumbnail(slug: string): Promise<string> {
    const storagePath = `thumbnail/${slug}.svg`;
    const buffer = await fs.readFile(PLACEHOLDER_PATH);
    await this.upload(storagePath, buffer, 'image/svg+xml');
    return this.getPublicUrl(storagePath);
  }

  async deleteFiles(slug: string): Promise<void> {
    const paths = [
      `source/${slug}.zip`,
      ...(await this.listAllFiles(`preview/${slug}`)),
      ...(await this.listThumbnailFiles(slug)),
    ];

    if (paths.length === 0) return;

    const batchSize = 100;
    for (let i = 0; i < paths.length; i += batchSize) {
      const batch = paths.slice(i, i + batchSize).map((p) => this.sanitizePath(p));
      const { error } = await this.client.storage.from(this.bucket).remove(batch);
      if (error) throw new Error(`Storage delete failed: ${error.message}`);
    }
  }

  private async listThumbnailFiles(slug: string): Promise<string[]> {
    const { data, error } = await this.client.storage.from(this.bucket).list('thumbnail', {
      limit: 1000,
    });
    if (error) throw new Error(`Storage list failed: ${error.message}`);
    return (data || [])
      .filter((item) => item.name.startsWith(`${slug}.`) && item.id !== null)
      .map((item) => `thumbnail/${item.name}`);
  }

  private async listAllFiles(folder: string): Promise<string[]> {
    const { data, error } = await this.client.storage.from(this.bucket).list(folder, {
      limit: 1000,
    });
    if (error) {
      if (error.message?.includes('not found')) return [];
      throw new Error(`Storage list failed: ${error.message}`);
    }

    const files: string[] = [];
    for (const item of data || []) {
      const itemPath = `${folder}/${item.name}`;
      if (item.id === null) {
        files.push(...(await this.listAllFiles(itemPath)));
      } else {
        files.push(itemPath);
      }
    }
    return files;
  }

  private async collectFiles(
    localDir: string,
    storagePrefix: string,
    relativePrefix: string
  ): Promise<Array<{ storagePath: string; localPath: string }>> {
    const files: Array<{ storagePath: string; localPath: string }> = [];
    const entries = await fs.readdir(localDir, { withFileTypes: true });

    for (const entry of entries) {
      const localPath = path.join(localDir, entry.name);
      const relPath = `${relativePrefix}${entry.name}`.replace(/\\/g, '/');

      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        files.push(...(await this.collectFiles(localPath, storagePrefix, `${relPath}/`)));
      } else {
        files.push({
          storagePath: `${storagePrefix}/${relPath}`,
          localPath,
        });
      }
    }

    return files;
  }

  private async runPool<T>(
    items: T[],
    concurrency: number,
    worker: (item: T) => Promise<void>
  ): Promise<void> {
    let index = 0;

    const runWorker = async () => {
      while (index < items.length) {
        const current = items[index++];
        await worker(current);
      }
    };

    await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runWorker));
  }
}

export const storageService = new StorageService();
