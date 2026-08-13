import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty, itemsPrice, shippingPrice, totalPrice, cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) navigate('/login?redirect=checkout');
    else navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <Helmet><title>Cart - FusionScent</title></Helmet>
        <div className="empty-icon">🛍️</div>
        <h2>Your cart is empty</h2>
        <p>Discover our luxury mini perfume collection and add your favorites.</p>
        <Link to="/shop" className="btn btn-primary btn-lg">Shop Now</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Cart ({cartCount}) - FusionScent</title></Helmet>

      <div className="page-hero-sm">
        <div className="container">
          <h1>Your Cart <span>({cartCount} {cartCount === 1 ? 'item' : 'items'})</span></h1>
        </div>
      </div>

      <div className="container cart-layout">
        {/* Items */}
        <div className="cart-items-wrap">
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-img-wrap">
                <img
                  src={item.images?.[0]?.url || 'https://via.placeholder.com/100?text=FS'}
                  alt={item.name}
                  className="cart-item-img"
                />
              </div>
              <div className="cart-item-info">
                <Link to={`/shop/${item.slug}`} className="cart-item-name">{item.name}</Link>
                <p className="cart-item-gender">{item.gender} · {item.size}</p>
                <div className="cart-item-bottom">
                  <div className="cart-qty-control">
                    <button onClick={() => updateQty(item._id, item.qty - 1)} disabled={item.qty <= 1}><FiMinus /></button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)}><FiPlus /></button>
                  </div>
                  <span className="cart-item-price">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              </div>
              <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)} aria-label="Remove"><FiTrash2 /></button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>${itemsPrice.toFixed(2)}</span></div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingPrice === 0 ? '🎉 Free' : `$${shippingPrice.toFixed(2)}`}</span>
          </div>
          {shippingPrice > 0 && (
            <p className="free-ship-hint">Add ${(100 - itemsPrice).toFixed(2)} more for free shipping</p>
          )}
          <div className="summary-row total"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }} onClick={handleCheckout}>
            Proceed to Checkout <FiArrowRight />
          </button>
          <Link to="/shop" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
            <FiShoppingBag /> Continue Shopping
          </Link>
          <div className="cart-trust">
            <span>🔒 Secure Checkout</span>
            <span>🚚 Free Shipping $100+</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
