const asyncHandler = require('express-async-handler');
const Subscriber = require('../models/Subscriber');

// @POST /api/subscribers
const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) { res.status(400); throw new Error('Email is required'); }
  await Subscriber.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { email: email.toLowerCase().trim() },
    { upsert: true, setDefaultsOnInsert: true }
  );
  res.status(201).json({ message: 'Subscribed' });
});

// @GET /api/subscribers (admin)
const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find().sort('-createdAt');
  res.json(subscribers);
});

module.exports = { subscribe, getSubscribers };
