import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './StaticPages.css';
import './PricingPage.css';

const tiers = [
  {
    name: 'Starter',
    price: '18',
    comparePrice: '20',
    desc: 'Perfect for trying your first FusionScent',
    features: ['1 × 10ml Decant Bottle', 'Choice of 1 Fragrance', 'Free Gift Wrapping', 'Standard Shipping'],
    cta: 'Shop Starter',
    link: '/shop',
    highlight: false,
  },
  {
    name: 'Discovery Set',
    price: '31.50',
    comparePrice: '35',
    desc: 'Our most popular option — explore 3 scents',
    features: ['3 × 10ml Decant Bottles', 'Choice of 3 Fragrances', 'Free Gift Wrapping', 'Priority Shipping + Free Shipping', '10% Off Future Orders'],
    cta: 'Shop Discovery',
    link: '/shop',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Collection',
    price: '45',
    comparePrice: '50',
    desc: 'The full FusionScent experience',
    features: ['5 × 10ml Decant Bottles', 'Choice of 5 Fragrances', 'Premium Gift Box + Travel Case', 'Free Shipping', '15% Off Future Orders', 'Exclusive Member Scent'],
    cta: 'Shop Collection',
    link: '/shop',
    highlight: false,
  },
];

const PricingPage = () => (
  <>
    <Helmet><title>Pricing - FusionScent</title></Helmet>

    <div className="page-hero" style={{ background: 'linear-gradient(135deg, var(--purple-deep), var(--purple-main))' }}>
      <div className="container">
        <span className="section-label" style={{ color: 'var(--purple-light)' }}>Transparent Pricing</span>
        <h1>Shop Bundle and Save</h1>
        <p>Save 10% on every bundle — luxury that fits every budget</p>
      </div>
    </div>

    <section className="section">
      <div className="container">
        <div className="pricing-grid">
          {tiers.map(t => (
            <div key={t.name} className={`pricing-card card ${t.highlight ? 'pricing-highlight' : ''}`}>
              {t.badge && <span className="pricing-badge">{t.badge}</span>}
              <div className="pricing-header">
                <h3>{t.name}</h3>
                <div className="pricing-price">
                  <span className="price-from">From</span>
                  <span className="price-amount">${t.price}</span>
                  {t.comparePrice && <span className="price-compare">${t.comparePrice}</span>}
                </div>
                <p className="pricing-desc">{t.desc}</p>
              </div>
              <ul className="pricing-features">
                {t.features.map(f => (
                  <li key={f}>
                    <FiCheck className="check-icon" />
                    <span>{f.includes('Future Orders') ? <>{f.replace('Future Orders', '')}<strong>Future Orders</strong></> : f}</span>
                  </li>
                ))}
              </ul>
              <Link to={t.link} className={`btn ${t.highlight ? 'btn-white' : 'btn-primary'}`} style={{ width: '100%', justifyContent: 'center' }}>
                {t.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="pricing-note">
          <p>💡 All decants are <strong>100% authentic</strong>, hand-decanted from the original bottle under sanitation guidelines.</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--text-body)', marginBottom: '1rem' }}>Need bulk or wholesale pricing? We've got you covered.</p>
          <Link to="/contact" className="btn btn-outline">Contact for Wholesale</Link>
        </div>
      </div>
    </section>
  </>
);

export default PricingPage;
