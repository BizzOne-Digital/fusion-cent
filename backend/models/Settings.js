const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'FusionScent' },
  tagline: { type: String, default: 'Luxury Scent in a Small Bottle' },
  logo: { url: String, public_id: String },
  heroTitle: { type: String, default: 'Fragrance That Defines You' },
  heroSubtitle: { type: String, default: 'Discover luxury mini refillable perfumes crafted for everyday life.' },
  heroImage: { url: String, public_id: String },
  bannerText: { type: String, default: 'Free Shipping on Orders Over $100 | 10% Off Your First Order | Track Order' },
  email: { type: String, default: 'fusion.scent@yahoo.com' },
  phone: { type: String, default: '9054622387' },
  website: { type: String, default: 'www.fusionscent.com' },
  socialLinks: {
    facebook: String,
    instagram: String,
    tiktok: String,
    pinterest: String,
  },
  freeShippingThreshold: { type: Number, default: 100 },
  firstOrderDiscount: { type: Number, default: 10 },
  aboutContent: { type: String, default: '' },
  faqItems: [{
    question: String,
    answer: String,
  }],
  testimonials: [{
    name: String,
    avatar: String,
    rating: Number,
    comment: String,
    isActive: { type: Boolean, default: true },
  }],
  metaTitle: { type: String, default: 'FusionScent - Luxury Scent in a Small Bottle' },
  metaDescription: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
