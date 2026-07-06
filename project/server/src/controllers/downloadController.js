import { Download } from '../models/Download.js';
import { Template } from '../models/Template.js';
import { storageService } from '../services/storage/storage.service.ts';
import {
  hasPurchaseAccess,
  getTemplateZipPath,
} from '../services/purchaseService.js';

const SIGNED_URL_EXPIRY = 600;

export const secureDownload = async (req, res, next) => {
  try {
    const { templateId } = req.params;
    const template = await Template.findById(templateId);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const hasAccess = await hasPurchaseAccess(req.user._id, template._id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Unauthorized download — purchase required' });
    }

    const zipPath = getTemplateZipPath(template);
    const signedUrl = await storageService.createSignedUrl(zipPath, SIGNED_URL_EXPIRY);

    const download = await Download.findOneAndUpdate(
      { user: req.user._id, template: template._id },
      {
        $inc: { downloadCount: 1 },
        lastDownloadAt: new Date(),
      },
      { new: true }
    );

    await Template.findByIdAndUpdate(template._id, { $inc: { downloads: 1 } });

    res.json({
      downloadUrl: signedUrl,
      expiresIn: SIGNED_URL_EXPIRY,
      downloadCount: download?.downloadCount || 1,
      slug: template.slug,
    });
  } catch (err) {
    if (err.message?.includes('Failed to generate signed URL')) {
      return res.status(500).json({ message: 'Failed to generate download link' });
    }
    next(err);
  }
};

export const getMyDownloads = async (req, res, next) => {
  try {
    const downloads = await Download.find({ user: req.user._id })
      .populate('template')
      .populate('order')
      .sort({ createdAt: -1 });

    const items = downloads.map((d) => ({
      id: d._id,
      template: d.template
        ? {
            id: d.template._id,
            title: d.template.title,
            slug: d.template.slug,
            thumbnailUrl: d.template.thumbnailUrl,
            framework: d.template.framework,
            category: d.template.category,
            price: d.template.price,
            isFree: d.template.isFree,
          }
        : null,
      downloadCount: d.downloadCount,
      lastDownloadAt: d.lastDownloadAt,
      purchasedAt: d.order?.createdAt || d.createdAt,
      invoiceNumber: d.order?.invoiceNumber,
    }));

    res.json(items);
  } catch (err) {
    next(err);
  }
};
