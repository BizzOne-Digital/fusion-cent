import React, { useState, useEffect } from 'react';
import { FiFilter, FiEdit2 } from 'react-icons/fi';
import { getOrders, updateOrderStatus } from '../utils/api';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusClass = { pending: 'adm-status-pending', processing: 'adm-status-processing', shipped: 'adm-status-shipped', delivered: 'adm-status-delivered', cancelled: 'adm-status-cancelled' };

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getOrders({ status: filter || undefined, page, limit: 20 });
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter, page]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success('Order status updated');
      setEditing(null);
      load();
    } catch { toast.error('Update failed'); }
  };

  return (
    <div>
      <div className="adm-page-header">
        <div><h1>Orders</h1><p>{total} total orders</p></div>
      </div>

      <div className="adm-card">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <button className={`adm-btn adm-btn-sm ${filter === '' ? 'adm-btn-primary' : 'adm-btn-outline'}`} onClick={() => { setFilter(''); setPage(1); }}>All</button>
          {STATUSES.map(s => (
            <button key={s} className={`adm-btn adm-btn-sm ${filter === s ? 'adm-btn-primary' : 'adm-btn-outline'}`}
              onClick={() => { setFilter(s); setPage(1); }} style={{ textTransform: 'capitalize' }}>{s}</button>
          ))}
        </div>

        {loading ? <div className="adm-spinner" /> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="adm-data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--adm-gray-400)', padding: '2rem' }}>No orders found</td></tr>
                ) : orders.map(order => (
                  <tr key={order._id}>
                    <td><code style={{ fontSize: '0.78rem' }}>#{order._id.slice(-8).toUpperCase()}</code></td>
                    <td>
                      <div>
                        <strong style={{ fontSize: '0.86rem' }}>{order.user?.name || 'Guest'}</strong>
                        <p style={{ fontSize: '0.74rem', color: 'var(--adm-gray-500)' }}>{order.user?.email}</p>
                      </div>
                    </td>
                    <td>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                    <td style={{ fontWeight: 700 }}>${order.totalPrice?.toFixed(2)}</td>
                    <td style={{ textTransform: 'capitalize', fontSize: '0.82rem' }}>{order.paymentMethod}</td>
                    <td>
                      {editing === order._id ? (
                        <select defaultValue={order.status} onChange={e => handleStatusChange(order._id, e.target.value)}
                          style={{ padding: '0.35rem', borderRadius: '6px', border: '1.5px solid var(--adm-purple-main)', fontSize: '0.8rem', outline: 'none' }}>
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span className={`adm-status-badge ${statusClass[order.status]}`}>{order.status}</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => setEditing(editing === order._id ? null : order._id)}>
                        <FiEdit2 /> {editing === order._id ? 'Cancel' : 'Update'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
