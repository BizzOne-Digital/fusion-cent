const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config();

const categoriesData = [
  { name: 'For Her', slug: 'for-her', description: 'Elegant fragrances crafted for her' },
  { name: 'For Him', slug: 'for-him', description: 'Bold fragrances crafted for him' },
  { name: 'Unisex', slug: 'unisex', description: 'Fragrances for everyone' },
];

const productsData = [
  {
    name: 'Velvet Rose',
    slug: 'velvet-rose',
    description: 'A luxurious rose fragrance with hints of musk and vanilla, crafted in a refillable 8ml bottle for everyday luxury.',
    shortDescription: 'Luxurious rose with musk and vanilla',
    price: 24.99,
    comparePrice: 34.99,
    gender: 'For Her',
    size: '8ml',
    stock: 50,
    isFeatured: true,
    isBestSeller: true,
    images: [{ url: '/hero.png', public_id: '' }],
    notes: { top: ['Rose', 'Bergamot'], middle: ['Jasmine', 'Peony'], base: ['Musk', 'Vanilla'] },
    tags: ['rose', 'floral', 'bestseller'],
  },
  {
    name: 'Midnight Oud',
    slug: 'midnight-oud',
    description: 'A deep, woody oud fragrance with smoky undertones — bold and unforgettable, refillable 8ml bottle.',
    shortDescription: 'Deep woody oud with smoky undertones',
    price: 29.99,
    comparePrice: 39.99,
    gender: 'For Him',
    size: '8ml',
    stock: 40,
    isFeatured: true,
    isBestSeller: true,
    images: [{ url: '/hero.png', public_id: '' }],
    notes: { top: ['Saffron', 'Black Pepper'], middle: ['Oud', 'Leather'], base: ['Amber', 'Sandalwood'] },
    tags: ['oud', 'woody', 'bestseller'],
  },
  {
    name: 'Citrus Breeze',
    slug: 'citrus-breeze',
    description: 'A fresh, energizing citrus scent perfect for daily wear — refillable 8ml bottle for any gender.',
    shortDescription: 'Fresh energizing citrus scent',
    price: 19.99,
    comparePrice: 0,
    gender: 'Unisex',
    size: '8ml',
    stock: 60,
    isFeatured: true,
    isNewArrival: true,
    images: [{ url: '/hero.png', public_id: '' }],
    notes: { top: ['Lemon', 'Grapefruit'], middle: ['Neroli', 'Mint'], base: ['Cedar', 'Musk'] },
    tags: ['citrus', 'fresh', 'new'],
  },
  {
    name: 'Golden Amber',
    slug: 'golden-amber',
    description: 'A warm amber fragrance with spiced undertones, ideal for evening wear — refillable 8ml bottle.',
    shortDescription: 'Warm amber with spiced undertones',
    price: 27.99,
    comparePrice: 32.99,
    gender: 'For Her',
    size: '8ml',
    stock: 35,
    isNewArrival: true,
    images: [{ url: '/hero.png', public_id: '' }],
    notes: { top: ['Cinnamon', 'Orange'], middle: ['Amber', 'Cardamom'], base: ['Vanilla', 'Tonka Bean'] },
    tags: ['amber', 'warm', 'new'],
  },
];

const seed = async () => {
  try {
    await connectDB();

    // 1. Admin user
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@fusionscent.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'FusionScent Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`Admin created -> email: ${adminEmail} | password: ${adminPassword}`);
    } else {
      console.log(`Admin already exists -> ${adminEmail}`);
    }

    // 2. Categories
    const categoryMap = {};
    for (const cat of categoriesData) {
      let existing = await Category.findOne({ slug: cat.slug });
      if (!existing) {
        existing = await Category.create(cat);
        console.log(`Category created: ${cat.name}`);
      }
      categoryMap[cat.name] = existing._id;
    }

    // 3. Products
    for (const prod of productsData) {
      const existing = await Product.findOne({ slug: prod.slug });
      if (existing) {
        console.log(`Product already exists: ${prod.name}`);
        continue;
      }
      const categoryId = categoryMap[prod.gender] || categoryMap['Unisex'];
      await Product.create({ ...prod, category: categoryId });
      console.log(`Product created: ${prod.name}`);
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
