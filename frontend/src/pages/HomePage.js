import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FiArrowRight, FiPlay, FiShoppingBag, FiShield,
  FiRefreshCw, FiTruck, FiAward, FiStar
} from 'react-icons/fi';
import ProductCard from '../components/common/ProductCard';
import { getProducts, getCategories } from '../utils/api';
import './HomePage.css';

const categoryIcons = ['👑', '🌸', '🌿', '💎', '✨', '🎁'];
const categoryLabels = ['For Her', 'For Him', 'Unisex', 'Best Sellers', 'New Arrivals', 'Gift Sets'];

const features = [
  { icon: <FiAward />, title: 'Premium Quality', desc: 'Finest fragrance ingredients from around the world' },
  { icon: <FiShield />, title: 'Long Lasting', desc: 'Scents that stay with you throughout the day' },
  { icon: <FiRefreshCw />, title: 'Refillable Design', desc: 'Eco-conscious refillable bottles — waste-free luxury' },
  { icon: <FiShield />, title: 'Secure Payment', desc: '100% safe and secure checkout experience' },
  { icon: <FiTruck />, title: 'Easy Returns', desc: 'Hassle-free return within 30 days' },
  { icon: <FiTruck />, title: 'Fast Shipping', desc: 'Worldwide delivery to your doorstep' },
];

const testimonials = [
  { name: 'Sarah K.', rating: 5, comment: 'The best mini perfume I\'ve ever used! Long-lasting and absolutely worth it. Perfect for travel.' },
  { name: 'James T.', rating: 5, comment: 'Elegant packaging and amazing fragrance. Highly recommended. My wife loves her bottle.' },
  { name: 'Sophia L.', rating: 5, comment: 'FusionScent has become my go-to brand for every occasion. Love the refillable concept!' },
];

const StarRating = ({ n }) => (
  <div className="stars">
    {[...Array(5)].map((_, i) => (
      <FiStar key={i} style={{ fill: i < n ? '#f59e0b' : 'none', color: '#f59e0b' }} />
    ))}
  </div>
);

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [f, b] = await Promise.all([
          getProducts({ featured: true, limit: 5 }),
          getProducts({ bestseller: true, limit: 5 }),
        ]);
        setFeatured(f.data.products || []);
        setBestsellers(b.data.products || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <Helmet>
        <title>FusionScent - Luxury Scent in a Small Bottle</title>
        <meta name="description" content="Mini refillable perfumes — luxury, sustainable, and portable. Shop FusionScent." />
      </Helmet>

      {/* ─── HERO ─── */}
      <section className="hero" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/${isMobile ? 'mobile-hero.png' : 'hero.png'})` }}>
        <div className="hero-bg-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="hero-inner container">
          <div className="hero-text">
            <span className="hero-eyebrow">✦ New Collection 2026</span>
            <h1 className="hero-title">
              Fragrance That<br />
              Defines <em>You</em>
            </h1>
            <p className="hero-subtitle">
              Discover luxury mini refillable perfumes crafted to leave a lasting impression — wherever life takes you.
            </p>
            <div className="hero-cta">
              <Link to="/shop" className="btn btn-primary btn-lg">
                <FiShoppingBag /> Shop Now
              </Link>
              <Link to="/about" className="btn btn-outline btn-lg hero-watch">
                <span className="play-icon"><FiPlay /></span> Our Story
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><strong>500+</strong><span>Fragrances</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>10k+</strong><span>Happy Customers</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>100%</strong><span>Refillable</span></div>
            </div>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <span />
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="section-sm categories-section">
        <div className="container">
          <div className="categories-grid">
            {categoryLabels.map((label, i) => (
              <Link
                key={label}
                to={i < 3 ? `/shop?gender=${encodeURIComponent(label)}` : i === 3 ? '/shop?bestseller=true' : i === 4 ? '/shop?newarrival=true' : '/shop'}
                className="category-chip"
              >
                <span className="cat-icon">{categoryIcons[i]}</span>
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="section products-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-label">Our Favorite Picks</span>
              <h2 className="section-title">Explore Our Most Loved Scents</h2>
            </div>
            <Link to="/shop" className="btn btn-outline">View All <FiArrowRight /></Link>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : featured.length > 0 ? (
            <div className="grid-4">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="empty-products">
              <p>Products coming soon. Check back shortly!</p>
              <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── PROMO BANNER ─── */}
      <section className="promo-banner" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/disscount.png)` }}>
        <div className="promo-inner container">
          <div className="promo-content">
            <span className="section-label" style={{ color: 'var(--purple-light)' }}>Limited Time Offer</span>
            <h2 className="promo-title">Get 10% Off<br />On Your First Order</h2>
            <p>Subscribe to our newsletter and use code <strong>WELCOME10</strong> at checkout</p>
            <Link to="/register" className="btn btn-gold btn-lg">
              Claim Offer <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BEST SELLERS ─── */}
      {bestsellers.length > 0 && (
        <section className="section products-section">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-label">Customer Favorites</span>
                <h2 className="section-title">Best Selling Scents</h2>
              </div>
              <Link to="/shop?bestseller=true" className="btn btn-outline">View All <FiArrowRight /></Link>
            </div>
            <div className="grid-4">
              {bestsellers.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ─── WHY CHOOSE US ─── */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">Why Choose FusionScent?</span>
            <h2 className="section-title">Crafted with Purpose</h2>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">What Our Customers Say</span>
            <h2 className="section-title">Loved by Thousands</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card card" key={i}>
                <div className="testimonial-quote">"</div>
                <StarRating n={t.rating} />
                <p className="testimonial-text">{t.comment}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>Verified Buyer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/testimonials" className="btn btn-outline">Read More Reviews <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* ─── SPECIAL OFFER STRIP ─── */}
      <section className="offer-strip">
        <div className="container offer-strip-inner">
          <p>🎁 Subscribe & get <strong>FREE SHIPPING</strong> + <strong>10% off</strong> your first order</p>
          <Link to="/register" className="btn btn-white btn-sm">Subscribe Now</Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;
