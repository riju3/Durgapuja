import express from 'express';
import multer from 'multer';
import Download from '../models/Download.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { Readable } from 'stream';
dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage - upload buffer directly to Cloudinary
const memStorage = multer.memoryStorage();
const uploadMem = multer({
  storage: memStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
  },
});

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

// GET all (public)
router.get('/', async (req, res) => {
  try {
    const items = await Download.find().sort('-createdAt');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH increment download count (public)
router.patch('/:id/download', async (req, res) => {
  try {
    const item = await Download.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    res.json({ downloadCount: item.downloadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create (admin)
router.post('/', protect, adminOnly, (req, res) => {
  uploadMem.single('file')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ message: err.message });
    }

    try {
      const { title, caption, category, year } = req.body;
      if (!title) return res.status(400).json({ message: 'Title is required' });

      let type = 'caption_only';
      let fileUrl = '';
      let publicId = '';
      let fileName = '';
      let fileSize = '';

      if (req.file) {
        const isImage = req.file.mimetype.startsWith('image/');
        const isPDF = req.file.mimetype === 'application/pdf';

        // Determine resource_type for Cloudinary
        const resourceType = isImage ? 'image' : 'raw';

        const uploadOptions = {
          folder: 'durgapuja-downloads',
          resource_type: resourceType,
          public_id: `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
          // For PDFs - allow inline viewing
          ...(isPDF && { flags: 'attachment' }),
        };

        console.log(`Uploading ${req.file.originalname} as resource_type: ${resourceType}`);

        const result = await uploadToCloudinary(req.file.buffer, uploadOptions);

        console.log('Cloudinary upload result:', result.secure_url);

        fileUrl = result.secure_url;
        publicId = result.public_id;
        fileName = req.file.originalname;
        fileSize = `${(req.file.size / 1024).toFixed(1)} KB`;

        if (isImage) type = 'image';
        else if (isPDF) type = 'pdf';
        else type = 'doc';
      }

      const item = await Download.create({
        title, caption, category,
        type, fileUrl, publicId, fileName, fileSize,
        year: year ? Number(year) : new Date().getFullYear(),
      });

      res.status(201).json(item);
    } catch (dbErr) {
      console.error('Error:', dbErr.message);
      res.status(500).json({ message: dbErr.message });
    }
  });
});

// PUT update (admin)
router.put('/:id', protect, adminOnly, (req, res) => {
  uploadMem.single('file')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const item = await Download.findById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Not found' });

      const data = {
        title: req.body.title,
        caption: req.body.caption,
        category: req.body.category,
        year: req.body.year ? Number(req.body.year) : item.year,
      };

      if (req.file) {
        // Delete old file from Cloudinary
        if (item.publicId) {
          try {
            const oldResourceType = item.type === 'image' ? 'image' : 'raw';
            await cloudinary.uploader.destroy(item.publicId, { resource_type: oldResourceType });
            console.log('Old file deleted from Cloudinary');
          } catch (e) {
            console.log('Could not delete old file:', e.message);
          }
        }

        const isImage = req.file.mimetype.startsWith('image/');
        const resourceType = isImage ? 'image' : 'raw';

        const result = await uploadToCloudinary(req.file.buffer, {
          folder: 'durgapuja-downloads',
          resource_type: resourceType,
          public_id: `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
        });

        data.fileUrl = result.secure_url;
        data.publicId = result.public_id;
        data.fileName = req.file.originalname;
        data.fileSize = `${(req.file.size / 1024).toFixed(1)} KB`;
        data.type = isImage ? 'image' : req.file.mimetype === 'application/pdf' ? 'pdf' : 'doc';
      }

      const updated = await Download.findByIdAndUpdate(req.params.id, data, { new: true });
      res.json(updated);
    } catch (e) {
      console.error('Update error:', e.message);
      res.status(500).json({ message: e.message });
    }
  });
});

// DELETE (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await Download.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    if (item.publicId) {
      try {
        const resourceType = item.type === 'image' ? 'image' : 'raw';
        await cloudinary.uploader.destroy(item.publicId, { resource_type: resourceType });
        console.log(`Deleted ${item.publicId} from Cloudinary`);
      } catch (e) {
        console.log('Cloudinary delete error:', e.message);
      }
    }

    await item.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
