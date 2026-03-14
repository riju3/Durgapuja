import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  pujaYear: { type: Number, default: 2025 },
  youtubeUrl: { type: String, default: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  address: { type: String, default: 'Chowdhurybati, Durgapur, West Bengal' },
  addressBn: { type: String, default: 'চৌধুরীবাটি, দুর্গাপুর, পশ্চিমবঙ্গ' },
  email: { type: String, default: 'chowdhurybatidurgautsav@gmail.com' },
  phone: { type: String, default: '' },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  youtube: { type: String, default: '' },
  aboutText: { type: String, default: 'Celebrate the divine energy of Durga Maa with Chowdhurybati Durga Puja. Where every moment is a joyous embrace of heritage and festivity.' },
  aboutTextBn: { type: String, default: 'মা দুর্গার দিব্য শক্তির সাথে চৌধুরীবাটি দুর্গাপূজায় যোগ দিন। যেখানে প্রতিটি মুহূর্ত ঐতিহ্য ও উৎসবের আনন্দময় আলিঙ্গন।' },
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
