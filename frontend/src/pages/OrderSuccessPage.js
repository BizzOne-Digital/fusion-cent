import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const OrderSuccessPage = () => {
  const { state } = useLocation();
  return (
    <>
      <Helmet><title>Order Confirmed - FusionScent</title></Helmet>
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1.5rem', gap: '1rem' }}>
        <div style={{ fontSize: '5rem' }}>🎉</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--purple-deep)' }}>Order Placed!</h1>
        <p style={{ color: 'var(--text-body)', maxWidth: '400px', lineHeight: 1.7 }}>
          Thank you for your order. We've received it and will start processing it shortly. You'll receive a confirmation email soon.
        </p>
        {state?.orderId && (
          <p style={{ fontSize: '0.85rem', background: 'var(--purple-pale)', padding: '0.5rem 1.25rem', borderRadius: '50px', color: 'var(--purple-main)', fontWeight: 600 }}>
            Order ID: {state.orderId}
          </p>
        )}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/my-orders" className="btn btn-primary">Track My Order</Link>
          <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </>
  );
};

export const NotFoundPage = () => (
  <>
    <Helmet><title>404 - FusionScent</title></Helmet>
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1.5rem', gap: '1rem' }}>
      <div style={{ fontSize: '5rem' }}>🌸</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--purple-deep)' }}>404</h1>
      <p style={{ color: 'var(--text-body)', fontSize: '1.1rem' }}>This page seems to have drifted away, like a scent in the wind.</p>
      <Link to="/" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem' }}>Back to Home</Link>
    </div>
  </>
);

export default OrderSuccessPage;
