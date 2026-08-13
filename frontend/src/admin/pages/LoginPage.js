import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMail } from 'react-icons/fi';
import { useAdminAuth } from '../context/AdminAuthContext';
import toast from 'react-hot-toast';
import './LoginPage.css';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome to FusionScent Admin');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="login-logo">
          <span>✦</span>
          <div>
            <strong>FusionScent</strong>
            <small>Admin Panel</small>
          </div>
        </div>
        <h2>Sign In</h2>
        <p>Enter your admin credentials to continue</p>
        <form onSubmit={handleSubmit}>
          <div className="adm-form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <FiMail />
              <input type="email" required placeholder="admin@fusionscent.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <div className="adm-form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <FiLock />
              <input type="password" required placeholder="••••••••"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
          </div>
          <button type="submit" className="adm-btn adm-btn-primary adm-btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In to Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
