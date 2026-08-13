const router = require('express').Router();
const { upload, cloudinary } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

// Upload single image
router.post('/image', protect, admin, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) { res.status(400); throw new Error('No file uploaded'); }
  res.json({ url: req.file.path, public_id: req.file.filename });
}));

// Upload multiple images
router.post('/images', protect, admin, upload.array('images', 6), asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) { res.status(400); throw new Error('No files uploaded'); }
  const files = req.files.map(f => ({ url: f.path, public_id: f.filename }));
  res.json(files);
}));

// Delete image
router.delete('/image', protect, admin, asyncHandler(async (req, res) => {
  const { public_id } = req.body;
  await cloudinary.uploader.destroy(public_id);
  res.json({ message: 'Image deleted' });
}));

module.exports = router;
