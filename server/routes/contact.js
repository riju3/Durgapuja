import express from 'express';
import Contact from '../models/Contact.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = await Contact.create({ name, email, message });
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  const contacts = await Contact.find().sort('-createdAt');
  res.json(contacts);
});

router.patch('/:id/read', protect, adminOnly, async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  res.json(contact);
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;
