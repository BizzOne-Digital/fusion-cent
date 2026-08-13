const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { category, gender, search, featured, bestseller, newarrival, sort, page = 1, limit = 12 } = req.query;
  const query = {};
  if (category) query.category = category;
  if (gender) query.gender = gender;
  if (featured) query.isFeatured = true;
  if (bestseller) query.isBestSeller = true;
  if (newarrival) query.isNewArrival = true;
  if (search) query.$text = { $search: search };

  const sortOptions = { newest: '-createdAt', priceLow: 'price', priceHigh: '-price', rating: '-rating' };
  const sortBy = sortOptions[sort] || '-createdAt';

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sortBy)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @GET /api/products/:slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
});

// @POST /api/products (admin)
const createProduct = asyncHandler(async (req, res) => {
  const slug = req.body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const product = await Product.create({ ...req.body, slug });
  res.status(201).json(product);
});

// @PUT /api/products/:id (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
});

// @DELETE /api/products/:id (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ message: 'Product deleted' });
});

module.exports = { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct };
