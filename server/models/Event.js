import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameBn: { type: String, default: '' },
  date: { type: String, required: true },
  description: { type: String, default: '' },
  descriptionBn: { type: String, default: '' },
  image: { type: String, default: '' },
  publicId: { type: String, default: '' },
  year: { type: Number, default: new Date().getFullYear() },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
