import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import galleryRoutes from './routes/gallery.js';
import eventsRoutes from './routes/events.js';
import teamRoutes from './routes/team.js';
import contactRoutes from './routes/contact.js';
import settingsRoutes from './routes/settings.js';
import downloadsRoutes from './routes/downloads.js';

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/downloads', downloadsRoutes);

app.get('/', (req, res) => res.json({ message: 'Chowdhurybati Durga Puja API 🙏' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB Connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(` Server on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error(' MongoDB Error:', err));
