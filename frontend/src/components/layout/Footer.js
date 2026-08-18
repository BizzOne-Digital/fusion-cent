import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiGlobe, FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaApplePay } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Subscribed! 10% off code sent to your email.');
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="FusionScent" className="footer-logo-img" />
          </div>
          <p className="footer-tagline">Luxury Scent in a Small Bottle</p>
          <p className="footer-about">
            Mini refillable perfumes crafted for everyday luxury. Quality, convenience, and sustainability in every bottle.
          </p>
          <div className="footer-contact">
            <a href="tel:9054622387"><FiPhone /> 905-462-2387</a>
            <a href="mailto:fusion.scent@yahoo.com"><FiMail /> fusion.scent@yahoo.com</a>
            <a href="https://www.fusionscent.com" target="_blank" rel="noreferrer"><FiGlobe /> fusionscent.com</a>
          </div>
          <div className="footer-social">
            <a href="#!" aria-label="Instagram"><FiInstagram /></a>
            <a href="#!" aria-label="Facebook"><FiFacebook /></a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop All</Link></li>
            <li><Link to="/shop?bestseller=true">Best Sellers</Link></li>
            <li><Link to="/shop?newarrival=true">New Arrivals</Link></li>
            <li><Link to="/shop?gender=For+Her">Women</Link></li>
            <li><Link to="/shop?gender=For+Him">Men</Link></li>
            <li><Link to="/shop?gender=Unisex">Unisex</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Get 10% Off Your First Order</h4>
          <p>Subscribe and enjoy free shipping + exclusive offers</p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          <p className="privacy-note">No spam. Unsubscribe anytime.</p>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} FusionScent. All rights reserved.</p>
        <div className="footer-badges">
          <span>🔒 Secure Checkout</span>
          <span>🌿 Eco-Friendly</span>
          <span>♻️ Refillable</span>
        </div>
        <div className="footer-payments" aria-label="Accepted payment methods">
          <FaCcVisa title="Visa" />
          <FaCcMastercard title="Mastercard" />
          <FaCcPaypal title="PayPal" />
          <FaApplePay title="Apple Pay" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
