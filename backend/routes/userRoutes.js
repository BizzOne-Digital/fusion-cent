const router = require('express').Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  res.json(users);
}));

router.put('/:id/role', protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json(user);
}));

module.exports = router;
