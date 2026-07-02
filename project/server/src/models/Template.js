import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    framework: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0, default: 0 },
    isFree: { type: Boolean, required: true, default: true },
    thumbnailUrl: { type: String, required: true },
    sourceZipUrl: { type: String, required: true },
    previewUrl: { type: String, required: true },
    previewIndexPath: { type: String, required: true, default: 'index.html' },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Template = mongoose.model('Template', templateSchema);
