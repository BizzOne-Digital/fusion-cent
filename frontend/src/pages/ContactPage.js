import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiPhone, FiGlobe, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './StaticPages.css';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent! We will respond within 24 hours.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <>
      <Helmet><title>Contact Us - FusionScent</title></Helmet>

      <div className="page-hero" style={{ background: 'linear-gradient(135deg, var(--purple-deep), var(--purple-main))' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--purple-light)' }}>Get In Touch</span>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Let's Talk</h2>
              <p>Have a question about our products, your order, or anything else? Reach out and we'll get back to you as soon as possible.</p>

              <div className="contact-detail">
                <FiPhone />
                <div><strong>Phone</strong><span>905-462-2387</span></div>
              </div>
              <div className="contact-detail">
                <FiMail />
                <div><strong>Email</strong><span>fusion.scent@yahoo.com</span></div>
              </div>
              <div className="contact-detail">
                <FiGlobe />
                <div><strong>Website</strong><span>www.fusionscent.com</span></div>
              </div>

              <div style={{ marginTop: '2rem', background: 'var(--purple-bg)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>🎁 First-Time Buyer?</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.7 }}>
                  Subscribe to our newsletter and enjoy <strong>free shipping</strong> + <strong>10% off</strong> your first order.
                </p>
              </div>
            </div>

            <div className="contact-form-card">
              <h3>Send Us a Message</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 (000) 000-0000" />
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <select required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                    <option value="">Select a subject</option>
                    <option>Order Inquiry</option>
                    <option>Product Question</option>
                    <option>Shipping & Delivery</option>
                    <option>Returns & Refunds</option>
                    <option>Wholesale / Bulk Order</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us how we can help..." />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={sending}>
                  <FiSend /> {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
