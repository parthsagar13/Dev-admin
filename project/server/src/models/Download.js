import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true, index: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    downloadCount: { type: Number, default: 0 },
    lastDownloadAt: { type: Date },
  },
  { timestamps: true }
);

downloadSchema.index({ user: 1, template: 1 }, { unique: true });

export const Download = mongoose.model('Download', downloadSchema);
