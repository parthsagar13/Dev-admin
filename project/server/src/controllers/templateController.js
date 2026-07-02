import { Template } from '../models/Template.js';
import { generateSlug } from '../utils/slug.js';
import { processTemplateUpload } from '../services/zipService.js';
import { storageService } from '../services/storage/storage.service.ts';

const normalizeRelativePath = (filename) =>
  filename.replace(/\\/g, '/').replace(/^\/+/, '');

export const getTemplates = async (_req, res, next) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    next(err);
  }
};

export const getTemplateBySlug = async (req, res, next) => {
  try {
    const template = await Template.findOne({ slug: req.params.slug });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (err) {
    next(err);
  }
};

export const uploadTemplate = async (req, res, next) => {
  try {
    const { title, framework, category, price, isFree } = req.body;

    if (!title || !framework || !category) {
      return res.status(400).json({ message: 'Title, framework, and category are required' });
    }

    const sourceZip = req.files?.sourceZip?.[0];
    const previewZip = req.files?.previewZip?.[0];
    const previewFiles = req.files?.previewFiles || [];

    if (!sourceZip) {
      return res.status(400).json({ message: 'Source ZIP is required' });
    }

    if (!previewZip && previewFiles.length === 0) {
      return res.status(400).json({ message: 'Preview ZIP or preview project files are required' });
    }

    const slug = generateSlug(title);
    const parsedPrice = Number(price) || 0;
    const free = isFree === 'true' || isFree === true;

    const previewInput = previewZip
      ? { type: 'zip', buffer: previewZip.buffer }
      : {
          type: 'files',
          files: previewFiles.map((file) => ({
            buffer: file.buffer,
            relativePath: normalizeRelativePath(file.originalname),
          })),
        };

    const thumbnailFile = req.files?.thumbnail?.[0];
    const customThumbnail = thumbnailFile
      ? { buffer: thumbnailFile.buffer, mimeType: thumbnailFile.mimetype }
      : null;

    const { sourceZipUrl, previewUrl, previewIndexPath, thumbnailUrl } = await processTemplateUpload(
      sourceZip.buffer,
      previewInput,
      slug,
      customThumbnail
    );

    const template = await Template.create({
      title: title.trim(),
      slug,
      framework: framework.trim(),
      category: category.trim(),
      price: free ? 0 : parsedPrice,
      isFree: free,
      thumbnailUrl,
      sourceZipUrl,
      previewUrl,
      previewIndexPath,
    });

    res.status(201).json(template);
  } catch (err) {
    next(err);
  }
};

export const updateTemplate = async (req, res, next) => {
  try {
    const { title, framework, category, price, isFree } = req.body;
    const updates = {};

    if (title) updates.title = title.trim();
    if (framework) updates.framework = framework.trim();
    if (category) updates.category = category.trim();
    if (price !== undefined) updates.price = Number(price);
    if (isFree !== undefined) {
      updates.isFree = isFree === 'true' || isFree === true;
      if (updates.isFree) updates.price = 0;
    }

    const template = await Template.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(template);
  } catch (err) {
    next(err);
  }
};

export const deleteTemplate = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    await storageService.deleteFiles(template.slug);
    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: 'Template deleted' });
  } catch (err) {
    next(err);
  }
};

export const downloadTemplate = async (req, res, next) => {
  try {
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({
      downloadUrl: template.sourceZipUrl,
      downloads: template.downloads,
    });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = async (_req, res, next) => {
  try {
    const totalTemplates = await Template.countDocuments();
    const latestTemplates = await Template.find().sort({ createdAt: -1 }).limit(5);

    res.json({ totalTemplates, latestTemplates });
  } catch (err) {
    next(err);
  }
};
