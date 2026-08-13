import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiTag, FiShoppingCart,
  FiStar, FiSettings, FiUsers, FiLogOut,
  FiBell, FiMenu, FiX, FiChevronRight
} from 'react-icons/fi';
import { useAdminAuth } from '../context/AdminAuthContext';
import './AdminLayout.css';

const navItems = [
  { to: '/admin/dashboard', icon: <FiGrid />, label: 'Dashboard' },
  { to: '/admin/products', icon: <FiPackage />, label: 'Products' },
  { to: '/admin/categories', icon: <FiTag />, label: 'Categories' },
  { to: '/admin/orders', icon: <FiShoppingCart />, label: 'Orders' },
  { to: '/admin/reviews', icon: <FiStar />, label: 'Reviews' },
  { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
  { to: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
];

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="adm-logo-icon">✦</span>
          <div>
            <span className="adm-logo-text">FusionScent</span>
            <span className="logo-sub">Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              <FiChevronRight className="nav-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-user">
            <div className="admin-avatar">{admin?.name?.charAt(0)}</div>
            <div className="admin-info">
              <strong>{admin?.name}</strong>
              <span>Administrator</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(o => !o)}>
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <div className="header-title">FusionScent Admin</div>
          <div className="header-actions">
            <a href="/" target="_blank" rel="noreferrer" className="view-site-btn">
              View Site ↗
            </a>
            <button className="header-icon-btn"><FiBell /></button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
