import express from 'express';
import Team from '../models/Team.js';
import { upload } from '../cloudinary.js';
import cloudinaryDefault from '../cloudinary.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const team = await Team.find().sort('order');
    res.json(team);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Upload failed' });
    try {
      const data = { ...req.body };
      if (req.file) { data.image = req.file.path; data.publicId = req.file.filename; }
      const member = await Team.create(data);
      res.status(201).json(member);
    } catch (e) { res.status(500).json({ message: e.message }); }
  });
});

router.put('/:id', protect, adminOnly, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Upload failed' });
    try {
      const member = await Team.findById(req.params.id);
      if (!member) return res.status(404).json({ message: 'Not found' });
      const data = { ...req.body };
      if (req.file) {
        if (member.publicId) await cloudinaryDefault.uploader.destroy(member.publicId);
        data.image = req.file.path; data.publicId = req.file.filename;
      }
      const updated = await Team.findByIdAndUpdate(req.params.id, data, { new: true });
      res.json(updated);
    } catch (e) { res.status(500).json({ message: e.message }); }
  });
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Not found' });
    if (member.publicId) await cloudinaryDefault.uploader.destroy(member.publicId);
    await member.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
