const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

const getStripe = () => require('stripe')(process.env.STRIPE_SECRET_KEY);

// @POST /api/payments/create-checkout-session
const createCheckoutSession = asyncHandler(async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(500);
    throw new Error('Stripe is not configured on the server');
  }
  const stripe = getStripe();
  const { items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice, couponCode, discount, isSubscriber } = req.body;
  if (!items || items.length === 0) { res.status(400); throw new Error('No order items'); }

  const order = await Order.create({
    user: req.user._id, items, shippingAddress, paymentMethod: 'stripe',
    itemsPrice, shippingPrice, totalPrice, couponCode, discount, isSubscriber,
    paymentStatus: 'pending',
  });

  const line_items = items.map(i => ({
    price_data: {
      currency: 'cad',
      product_data: { name: i.name },
      unit_amount: Math.round(i.price * 100),
    },
    quantity: i.quantity || 1,
  }));

  if (discount > 0) {
    line_items.push({
      price_data: { currency: 'cad', product_data: { name: `Discount (${couponCode || 'coupon'})` }, unit_amount: -Math.round(discount * 100) },
      quantity: 1,
    });
  }
  if (shippingPrice > 0) {
    line_items.push({
      price_data: { currency: 'cad', product_data: { name: 'Shipping' }, unit_amount: Math.round(shippingPrice * 100) },
      quantity: 1,
    });
  }

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items,
    success_url: `${clientUrl}/order-success?orderId=${order._id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/checkout`,
    customer_email: req.user.email,
    metadata: { orderId: order._id.toString() },
  });

  res.json({ url: session.url, orderId: order._id });
});

// @GET /api/payments/verify/:sessionId
const verifySession = asyncHandler(async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(500);
    throw new Error('Stripe is not configured on the server');
  }
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
  const orderId = session.metadata?.orderId;
  if (!orderId) { res.status(404); throw new Error('Order not found for this session'); }

  const order = await Order.findById(orderId);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }

  if (session.payment_status === 'paid' && order.paymentStatus !== 'paid') {
    order.paymentStatus = 'paid';
    order.paymentResult = { id: session.payment_intent, status: session.payment_status, update_time: new Date().toISOString() };
    if (order.status === 'pending') order.status = 'processing';
    await order.save();
  }

  res.json({ order, paid: session.payment_status === 'paid' });
});

module.exports = { createCheckoutSession, verifySession };
