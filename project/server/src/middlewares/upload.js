import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const ZIP_MIMES = ['application/zip', 'application/x-zip-compressed'];
const PREVIEW_EXTENSIONS = new Set([
  '.html', '.htm', '.css', '.js', '.mjs', '.json',
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico',
  '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.webm', '.map', '.xml', '.txt',
]);

const fileFilter = (_req, file, cb) => {
  if (file.fieldname === 'sourceZip' || file.fieldname === 'previewZip') {
    if (ZIP_MIMES.includes(file.mimetype) || file.originalname.endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('Only ZIP files are allowed for source/preview ZIP'), false);
    }
    return;
  }

  if (file.fieldname === 'previewFiles') {
    const ext = path.extname(file.originalname).toLowerCase();
    if (PREVIEW_EXTENSIONS.has(ext)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
    return;
  }

  if (file.fieldname === 'thumbnail') {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Thumbnail must be JPG, PNG, or WEBP'), false);
    }
    return;
  }

  cb(new Error('Unexpected upload field'), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter,
});

export const uploadTemplateFiles = upload.fields([
  { name: 'sourceZip', maxCount: 1 },
  { name: 'previewZip', maxCount: 1 },
  { name: 'previewFiles', maxCount: 500 },
  { name: 'thumbnail', maxCount: 1 },
]);
