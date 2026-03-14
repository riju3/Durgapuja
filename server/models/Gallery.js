import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  caption: { type: String, default: '' },
  year: { type: Number, default: new Date().getFullYear() },
  category: { type: String, enum: ['pratima', 'cultural', 'bhog', 'general'], default: 'general' },
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
