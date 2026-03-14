import express from 'express';
import Gallery from '../models/Gallery.js';
import { upload } from '../cloudinary.js';
import cloudinaryDefault from '../cloudinary.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET all photos (with optional year filter)
router.get('/', async (req, res) => {
  try {
    const { year } = req.query;
    const filter = year ? { year: Number(year) } : {};
    const photos = await Gallery.find(filter).sort('-createdAt');
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST upload photo - with proper multer error handling
router.post('/', protect, adminOnly, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    try {
      const { caption, year, category } = req.body;
      console.log('Uploaded file:', req.file);
      const photo = await Gallery.create({
        url: req.file.path,
        publicId: req.file.filename,
        caption: caption || '',
        year: year ? Number(year) : new Date().getFullYear(),
        category: category || 'general',
      });
      res.status(201).json(photo);
    } catch (dbErr) {
      console.error('DB error:', dbErr);
      res.status(500).json({ message: dbErr.message });
    }
  });
});

// DELETE photo
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    // Delete from Cloudinary
    if (photo.publicId) {
      await cloudinaryDefault.uploader.destroy(photo.publicId);
    }
    await photo.deleteOne();
    res.json({ message: 'Photo deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
