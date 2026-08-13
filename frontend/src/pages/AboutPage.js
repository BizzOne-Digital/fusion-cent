import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './StaticPages.css';

const AboutPage = () => (
  <>
    <Helmet><title>About Us - FusionScent</title></Helmet>

    <div className="page-hero" style={{ background: 'linear-gradient(135deg, var(--purple-deep), var(--purple-main))' }}>
      <div className="container">
        <span className="section-label" style={{ color: 'var(--purple-light)' }}>Our Story</span>
        <h1>About FusionScent</h1>
        <p>Making fragrance simple, affordable, and sustainable</p>
      </div>
    </div>

    <section className="section">
      <div className="container-sm">
        <div className="about-grid">
          <div className="about-visual">
            <div className="about-emoji-card">
              <div style={{ fontSize: '5rem' }}>🌸</div>
              <h3>Our Mission</h3>
              <p>To make luxury fragrance accessible to everyone</p>
            </div>
          </div>
          <div className="about-content">
            <span className="section-label">Who We Are</span>
            <h2 className="section-title">Luxury Scent in a Small Bottle</h2>
            <p>At FusionScent, our mission is to make fragrance simple, affordable, portable, and sustainable. We create mini refillable perfumes that allow customers to enjoy their favorite scents wherever they go.</p>
            <p style={{ marginTop: '1rem' }}>We believe great fragrance should fit into everyday life. That's why FusionScent focuses on quality, convenience, reusability, and freedom of choice — giving customers the ability to refill their perfume whenever they need it.</p>
            <div className="about-values">
              {['Quality', 'Convenience', 'Reusability', 'Sustainability'].map(v => (
                <span key={v} className="value-pill">{v}</span>
              ))}
            </div>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Shop Our Collection</Link>
          </div>
        </div>
      </div>
    </section>

    <section className="section" style={{ background: 'var(--purple-bg)' }}>
      <div className="container">
        <div className="section-header centered">
          <span className="section-label">Why We're Different</span>
          <h2 className="section-title">The FusionScent Difference</h2>
        </div>
        <div className="grid-3">
          {[
            { icon: '♻️', title: 'Refillable', desc: 'Our bottles are designed to be refilled again and again, reducing waste.' },
            { icon: '💼', title: 'Portable', desc: 'Compact 8ml bottles that fit in any pocket, purse, or travel bag.' },
            { icon: '💎', title: 'Premium Quality', desc: 'Every fragrance is crafted with the finest ingredients from around the world.' },
          ].map(item => (
            <div key={item.title} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
              <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>{item.title}</h3>
              <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default AboutPage;
