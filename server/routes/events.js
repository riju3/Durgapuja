import express from 'express';
import Event from '../models/Event.js';
import { upload } from '../cloudinary.js';
import cloudinaryDefault from '../cloudinary.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { year } = req.query;
    const filter = year ? { year: Number(year) } : {};
    const events = await Event.find(filter).sort('order');
    res.json(events);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Upload failed' });
    try {
      const data = { ...req.body };
      if (req.file) { data.image = req.file.path; data.publicId = req.file.filename; }
      const event = await Event.create(data);
      res.status(201).json(event);
    } catch (e) { res.status(500).json({ message: e.message }); }
  });
});

router.put('/:id', protect, adminOnly, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Upload failed' });
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Not found' });
      const data = { ...req.body };
      if (req.file) {
        if (event.publicId) await cloudinaryDefault.uploader.destroy(event.publicId);
        data.image = req.file.path; data.publicId = req.file.filename;
      }
      const updated = await Event.findByIdAndUpdate(req.params.id, data, { new: true });
      res.json(updated);
    } catch (e) { res.status(500).json({ message: e.message }); }
  });
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Not found' });
    if (event.publicId) await cloudinaryDefault.uploader.destroy(event.publicId);
    await event.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
