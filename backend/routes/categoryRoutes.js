const router = require('express').Router();
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

router.get('/', asyncHandler(async (req, res) => {
  const cats = await Category.find({ isActive: true });
  res.json(cats);
}));

router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const slug = req.body.name.toLowerCase().replace(/\s+/g, '-');
  const cat = await Category.create({ ...req.body, slug });
  res.status(201).json(cat);
}));

router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(cat);
}));

router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted' });
}));

module.exports = router;
