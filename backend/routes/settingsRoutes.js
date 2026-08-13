const router = require('express').Router();
const Settings = require('../models/Settings');
const { protect, admin } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

router.get('/', asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json(settings);
}));

router.put('/', protect, admin, asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  res.json(settings);
}));

module.exports = router;
