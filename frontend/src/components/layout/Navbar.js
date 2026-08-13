import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const pagesLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/testimonials', label: 'Testimonials' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/faq', label: 'FAQ' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">Fusion<em>Scent</em></span>
        </Link>

        <ul className="navbar-links">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/shop">Shop</NavLink></li>
          <li><NavLink to="/shop?bestseller=true">Best Sellers</NavLink></li>
          <li className="has-dropdown">
            <span>Pages <FiChevronDown /></span>
            <ul className="dropdown">
              {pagesLinks.map(l => (
                <li key={l.to}><NavLink to={l.to}>{l.label}</NavLink></li>
              ))}
            </ul>
          </li>
          <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>

        <div className="navbar-actions">
          <button className="icon-btn" onClick={() => setSearchOpen(s => !s)} aria-label="Search">
            <FiSearch />
          </button>

          <div className="user-wrapper">
            <button className="icon-btn" onClick={() => setUserDropdown(d => !d)} aria-label="Account">
              <FiUser />
            </button>
            {userDropdown && (
              <div className="user-dropdown">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setUserDropdown(false)}>My Profile</Link>
                    <Link to="/my-orders" onClick={() => setUserDropdown(false)}>My Orders</Link>
                    <button onClick={() => { logout(); setUserDropdown(false); }}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setUserDropdown(false)}>Login</Link>
                    <Link to="/register" onClick={() => setUserDropdown(false)}>Register</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
            <FiShoppingBag />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <button className="icon-btn mobile-menu-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="search-bar">
          <form onSubmit={handleSearch} className="search-form container">
            <input
              autoFocus
              type="text"
              placeholder="Search perfumes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/shop" onClick={() => setMenuOpen(false)}>Shop</NavLink>
          <NavLink to="/shop?bestseller=true" onClick={() => setMenuOpen(false)}>Best Sellers</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>About Us</NavLink>
          <NavLink to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</NavLink>
          <NavLink to="/testimonials" onClick={() => setMenuOpen(false)}>Testimonials</NavLink>
          <NavLink to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</NavLink>
          <NavLink to="/faq" onClick={() => setMenuOpen(false)}>FAQ</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
          <NavLink to="/cart" onClick={() => setMenuOpen(false)}>Cart ({cartCount})</NavLink>
          {user ? (
            <>
              <NavLink to="/profile" onClick={() => setMenuOpen(false)}>My Profile</NavLink>
              <button onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
            </>
          ) : (
            <NavLink to="/login" onClick={() => setMenuOpen(false)}>Login / Register</NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
