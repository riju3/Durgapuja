import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  caption: { type: String, default: '' },
  type: { type: String, enum: ['image', 'pdf', 'doc', 'caption_only'], default: 'caption_only' },
  fileUrl: { type: String, default: '' },
  publicId: { type: String, default: '' },
  fileName: { type: String, default: '' },
  fileSize: { type: String, default: '' },
  year: { type: Number, default: new Date().getFullYear() },
  category: { type: String, default: 'general' },
  downloadCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Download', downloadSchema);
