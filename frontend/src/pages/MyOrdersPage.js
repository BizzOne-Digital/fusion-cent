import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../utils/api';

const statusColors = {
  pending: { bg: '#fef3c7', color: '#92400e' },
  processing: { bg: '#dbeafe', color: '#1e40af' },
  shipped: { bg: '#e0e7ff', color: '#3730a3' },
  delivered: { bg: '#d1fae5', color: '#065f46' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet><title>My Orders - FusionScent</title></Helmet>
      <div style={{ background: 'var(--purple-bg)', padding: '2rem 0', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container"><h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem' }}>My Orders</h1></div>
      </div>
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        {loading ? (
          <div className="spinner" />
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>No orders yet</h3>
            <p style={{ color: 'var(--text-body)', marginBottom: '1.5rem' }}>Start shopping and your orders will appear here.</p>
            <Link to="/shop" className="btn btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => (
              <div key={order._id} style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.2rem' }}>Order ID</p>
                    <p style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.2rem' }}>Date</p>
                    <p style={{ fontSize: '0.88rem' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.2rem' }}>Total</p>
                    <p style={{ fontWeight: 700, color: 'var(--purple-deep)' }}>${order.totalPrice.toFixed(2)}</p>
                  </div>
                  <span style={{ padding: '0.3rem 0.9rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize', ...statusColors[order.status] }}>
                    {order.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {order.items?.slice(0, 4).map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--purple-bg)', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.82rem' }}>
                      {item.name} × {item.quantity}
                    </div>
                  ))}
                  {order.items?.length > 4 && <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)', alignSelf: 'center' }}>+{order.items.length - 4} more</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrdersPage;
