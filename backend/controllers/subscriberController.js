const asyncHandler = require('express-async-handler');
const Subscriber = require('../models/Subscriber');
const { sendMail } = require('../utils/mailer');

// @POST /api/subscribers
const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) { res.status(400); throw new Error('Email is required'); }
  const cleanEmail = email.toLowerCase().trim();
  await Subscriber.findOneAndUpdate(
    { email: cleanEmail },
    { email: cleanEmail },
    { upsert: true, setDefaultsOnInsert: true }
  );

  sendMail({
    to: cleanEmail,
    subject: 'Welcome to FusionScent — Here\'s Your 10% Off Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #6b21a8;">Welcome to FusionScent 🌸</h2>
        <p>Thanks for subscribing! Use the code below to get 10% off your first order:</p>
        <p style="font-size: 1.4rem; font-weight: bold; background: #f3e8ff; color: #6b21a8; padding: 12px 20px; text-align: center; border-radius: 8px;">WELCOME10</p>
        <p>Apply it at checkout on any order. Happy shopping!</p>
        <p style="color: #888; font-size: 0.85rem;">FusionScent — Luxury Scent in a Small Bottle</p>
      </div>
    `,
  });

  res.status(201).json({ message: 'Subscribed' });
});

// @GET /api/subscribers (admin)
const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find().sort('-createdAt');
  res.json(subscribers);
});

module.exports = { subscribe, getSubscribers };
