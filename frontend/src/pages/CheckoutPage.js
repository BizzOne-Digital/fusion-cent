import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiTruck, FiCreditCard, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../utils/api';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const steps = ['Shipping', 'Payment', 'Review'];

const CheckoutPage = () => {
  const { cartItems, itemsPrice, shippingPrice, totalPrice, clearCart, user: cartUser } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({ fullName: user?.name || '', phone: '', street: '', city: '', state: '', zip: '', country: 'Canada' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'WELCOME10') {
      setDiscount(10);
      toast.success('Coupon applied! 10% discount added.');
    } else {
      toast.error('Invalid coupon code.');
    }
  };

  const discountAmount = (itemsPrice * discount) / 100;
  const finalTotal = totalPrice - discountAmount;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const { data } = await createOrder({
        items: cartItems.map(i => ({ product: i._id, name: i.name, image: i.images?.[0]?.url, price: i.price, quantity: i.qty })),
        shippingAddress: shipping,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice: finalTotal,
        couponCode: coupon,
        discount: discountAmount,
        isSubscriber: user?.isSubscribed,
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-success', { state: { orderId: data._id } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Checkout - FusionScent</title></Helmet>

      <div className="checkout-header">
        <div className="container checkout-steps">
          {steps.map((s, i) => (
            <div key={s} className={`checkout-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="step-circle">
                {i < step ? <FiCheck /> : i === 0 ? <FiTruck /> : i === 1 ? <FiCreditCard /> : '📦'}
              </div>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container checkout-layout">
        <div className="checkout-form-area">
          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="checkout-card">
              <h2>Shipping Address</h2>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input required value={shipping.fullName} onChange={e => setShipping(s => ({ ...s, fullName: e.target.value }))} placeholder="Jane Doe" />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input required value={shipping.phone} onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))} placeholder="+1 000 000 0000" />
                </div>
              </div>
              <div className="form-group">
                <label>Street Address *</label>
                <input required value={shipping.street} onChange={e => setShipping(s => ({ ...s, street: e.target.value }))} placeholder="123 Main St, Apt 4B" />
              </div>
              <div className="form-row-3">
                <div className="form-group">
                  <label>City *</label>
                  <input required value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} placeholder="Toronto" />
                </div>
                <div className="form-group">
                  <label>Province</label>
                  <input value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} placeholder="ON" />
                </div>
                <div className="form-group">
                  <label>Postal Code *</label>
                  <input required value={shipping.zip} onChange={e => setShipping(s => ({ ...s, zip: e.target.value }))} placeholder="A1A 1A1" />
                </div>
              </div>
              <div className="form-group">
                <label>Country</label>
                <select value={shipping.country} onChange={e => setShipping(s => ({ ...s, country: e.target.value }))}>
                  <option>Canada</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Other</option>
                </select>
              </div>
              <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => { if (!shipping.fullName || !shipping.street || !shipping.city) { toast.error('Please fill required fields'); return; } setStep(1); }}>
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="checkout-card">
              <h2>Payment Method</h2>
              <div className="payment-options">
                {[
                  { value: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when your order arrives' },
                  { value: 'bank', label: '🏦 Bank Transfer', desc: 'Transfer to our account — we confirm within 24hrs' },
                  { value: 'stripe', label: '💳 Credit / Debit Card', desc: 'Secure online payment via Stripe' },
                ].map(opt => (
                  <label key={opt.value} className={`payment-option ${paymentMethod === opt.value ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value)} />
                    <div>
                      <strong>{opt.label}</strong>
                      <span>{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
              <div className="coupon-row">
                <input placeholder="Coupon code (e.g. WELCOME10)" value={coupon} onChange={e => setCoupon(e.target.value)} />
                <button className="btn btn-outline" onClick={applyCoupon}>Apply</button>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button className="btn btn-outline" onClick={() => setStep(0)}>Back</button>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(2)}>Review Order</button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="checkout-card">
              <h2>Review Your Order</h2>
              {cartItems.map(item => (
                <div key={item._id} className="review-item-row">
                  <img src={item.images?.[0]?.url || 'https://via.placeholder.com/60?text=FS'} alt={item.name} />
                  <div className="review-item-info">
                    <strong>{item.name}</strong>
                    <span>Qty: {item.qty} · {item.size}</span>
                  </div>
                  <span className="review-item-price">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }} onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Placing Order...' : '🎉 Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cartItems.map(i => (
            <div key={i._id} className="checkout-summary-item">
              <span>{i.name} × {i.qty}</span>
              <span>${(i.price * i.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-row"><span>Subtotal</span><span>${itemsPrice.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span></div>
          {discount > 0 && <div className="summary-row" style={{ color: 'green' }}><span>Discount ({discount}%)</span><span>-${discountAmount.toFixed(2)}</span></div>}
          <div className="summary-row total"><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
