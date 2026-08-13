const router = require('express').Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

// Get reviews for a product
router.get('/product/:productId', asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, isApproved: true })
    .populate('user', 'name avatar');
  res.json(reviews);
}));

// Create review
router.post('/', protect, asyncHandler(async (req, res) => {
  const { product, rating, comment } = req.body;
  const existing = await Review.findOne({ user: req.user._id, product });
  if (existing) { res.status(400); throw new Error('Already reviewed this product'); }
  const review = await Review.create({ user: req.user._id, product, rating, comment });
  // Update product rating
  const reviews = await Review.find({ product, isApproved: true });
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(product, { rating: avg.toFixed(1), numReviews: reviews.length });
  res.status(201).json(review);
}));

// Approve review (admin)
router.put('/:id/approve', protect, admin, asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  res.json(review);
}));

// Get all reviews (admin)
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const reviews = await Review.find().populate('user', 'name').populate('product', 'name');
  res.json(reviews);
}));

module.exports = router;
