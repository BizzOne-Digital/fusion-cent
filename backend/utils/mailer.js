const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }
  return transporter;
};

const sendMail = async ({ to, subject, html }) => {
  const t = getTransporter();
  if (!t) {
    console.warn('Email not sent (EMAIL_USER/EMAIL_PASS not configured):', subject);
    return;
  }
  try {
    await t.sendMail({ from: `FusionScent <${process.env.EMAIL_USER}>`, to, subject, html });
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
};

const notifyNewOrder = async (order) => {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) return;
  const itemsHtml = order.items.map(i => `<li>${i.name} × ${i.quantity} — $${i.price.toFixed(2)}</li>`).join('');
  await sendMail({
    to: adminEmail,
    subject: `New Order #${order._id.toString().slice(-8).toUpperCase()} — $${order.totalPrice.toFixed(2)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #6b21a8;">New Order Received</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
        <p><strong>Shipping to:</strong> ${order.shippingAddress?.fullName}, ${order.shippingAddress?.street}, ${order.shippingAddress?.city}</p>
        <p><strong>Items:</strong></p>
        <ul>${itemsHtml}</ul>
      </div>
    `,
  });
};

module.exports = { sendMail, notifyNewOrder };
