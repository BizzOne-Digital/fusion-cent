import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiPackage, FiDollarSign, FiUsers, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getOrderStats, getOrders, getProducts } from '../utils/api';
import './DashboardPage.css';

const revenueData = [
  { month: 'Mar', revenue: 1200 }, { month: 'Apr', revenue: 1800 },
  { month: 'May', revenue: 2400 }, { month: 'Jun', revenue: 2100 },
  { month: 'Jul', revenue: 3200 }, { month: 'Aug', revenue: 2900 },
];

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, o, p] = await Promise.all([
          getOrderStats(),
          getOrders({ limit: 5 }),
          getProducts({ limit: 1 }),
        ]);
        setStats(s.data);
        setRecentOrders(o.data.orders || []);
        setProductCount(p.data.total || 0);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, icon: <FiDollarSign />, color: 'purple', change: '+12%' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <FiShoppingCart />, color: 'blue', change: '+8%' },
    { label: 'Products', value: productCount, icon: <FiPackage />, color: 'green', change: 'Active' },
    { label: 'This Month', value: `$${(stats?.totalRevenue * 0.3)?.toFixed(2) || '0.00'}`, icon: <FiTrendingUp />, color: 'gold', change: '+24%' },
  ];

  const statusMap = { pending: 'adm-status-pending', processing: 'adm-status-processing', shipped: 'adm-status-shipped', delivered: 'adm-status-delivered', cancelled: 'adm-status-cancelled' };

  return (
    <div className="dashboard">
      <div className="adm-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back — here's what's happening with FusionScent today.</p>
        </div>
      </div>

      {loading ? <div className="adm-spinner" /> : (
        <>
          {/* Stat Cards */}
          <div className="stat-cards">
            {statCards.map((card, i) => (
              <div key={i} className={`stat-card adm-card stat-${card.color}`}>
                <div className="stat-card-header">
                  <span className="stat-label">{card.label}</span>
                  <div className="stat-icon">{card.icon}</div>
                </div>
                <div className="stat-value">{card.value}</div>
                <div className="stat-change">{card.change} <span>vs last month</span></div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            <div className="adm-card chart-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Revenue Overview</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--adm-gray-500)', marginTop: '0.2rem' }}>Last 6 months</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenueData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={v => [`$${v}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#6b21a8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="adm-card chart-card chart-sm">
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>Order Status Breakdown</h3>
              {stats?.byStatus?.map((s, i) => (
                <div key={i} className="status-row">
                  <span className={`adm-status-badge ${statusMap[s._id] || ''}`}>{s._id}</span>
                  <div className="status-bar-wrap">
                    <div className="status-bar" style={{ width: `${Math.min((s.count / (stats.totalOrders || 1)) * 100, 100)}%` }} />
                  </div>
                  <span className="status-count">{s.count}</span>
                </div>
              ))}
              {(!stats?.byStatus || stats.byStatus.length === 0) && (
                <p style={{ color: 'var(--adm-gray-400)', fontSize: '0.85rem' }}>No orders yet</p>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="adm-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Recent Orders</h3>
              <Link to="/admin/orders" className="adm-btn adm-btn-outline adm-btn-sm">View All <FiArrowRight /></Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="adm-data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--adm-gray-400)' }}>No orders yet</td></tr>
                  ) : recentOrders.map(order => (
                    <tr key={order._id}>
                      <td><code style={{ fontSize: '0.78rem' }}>#{order._id.slice(-6).toUpperCase()}</code></td>
                      <td>{order.user?.name || 'Guest'}</td>
                      <td>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                      <td style={{ fontWeight: 600 }}>${order.totalPrice?.toFixed(2)}</td>
                      <td><span className={`adm-status-badge ${statusMap[order.status]}`}>{order.status}</span></td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
