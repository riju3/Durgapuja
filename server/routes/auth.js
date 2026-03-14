import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, role: 'user' });
    res.status(201).json({ token: generateToken(user), user: { id: user._id, name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: generateToken(user), user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get me
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// Seed admin (run once) - works via GET or POST for easy browser access
router.get('/seed-admin', async (req, res) => {
  try {
    const exists = await User.findOne({ role: 'admin' });
    if (exists) return res.json({ message: 'Admin already exists', email: exists.email });
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@durgapuja.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@1234',
      role: 'admin'
    });
    res.json({ message: '✅ Admin created successfully!', email: admin.email, password: process.env.ADMIN_PASSWORD || 'Admin@1234' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/seed-admin', async (req, res) => {
  try {
    const exists = await User.findOne({ role: 'admin' });
    if (exists) return res.json({ message: 'Admin already exists' });
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@durgapuja.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@1234',
      role: 'admin'
    });
    res.json({ message: 'Admin created', email: admin.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
