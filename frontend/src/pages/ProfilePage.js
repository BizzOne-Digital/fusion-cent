import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './StaticPages.css';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, phone: form.phone };
      if (form.password) payload.password = form.password;
      await axios.put(`${process.env.REACT_APP_API_URL || '/api'}/auth/profile`, payload);
      toast.success('Profile updated successfully.');
      setForm(f => ({ ...f, password: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>My Profile - FusionScent</title></Helmet>
      <div className="page-hero-sm" style={{ background: 'var(--purple-bg)', padding: '2rem 0', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container"><h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem' }}>My Profile</h1></div>
      </div>
      <div className="container" style={{ maxWidth: '600px', padding: '3rem 1.5rem' }}>
        <div className="contact-form-card">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--purple-main)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, margin: '0 auto 0.75rem' }}>
              {user?.name?.charAt(0)}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-body)' }}>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Full Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Optional" />
            </div>
            <div className="form-group">
              <label>New Password <span style={{ color: 'var(--gray-500)', fontWeight: 400 }}>(leave blank to keep current)</span></label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
