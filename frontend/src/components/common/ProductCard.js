import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const img = product.images?.[0]?.url || 'https://via.placeholder.com/400x400?text=FusionScent';
  const discount = product.comparePrice > product.price
    ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;

  return (
    <div className="product-card card">
      <div className="product-card-img-wrap">
        <Link to={`/shop/${product.slug}`}>
          <img src={img} alt={product.name} className="product-card-img" loading="lazy" />
        </Link>

        <div className="product-card-badges">
          {product.isBestSeller && <span className="badge badge-gold">Best Seller</span>}
          {product.isNewArrival && <span className="badge badge-purple">New</span>}
          {discount > 0 && <span className="badge" style={{ background: '#fef2f2', color: '#dc2626' }}>-{discount}%</span>}
        </div>

        <div className="product-card-actions">
          <button className="card-action-btn" aria-label="Wishlist"><FiHeart /></button>
          <button
            className="card-action-btn add-cart-btn"
            onClick={() => addToCart(product)}
            aria-label="Add to cart"
          >
            <FiShoppingBag />
          </button>
        </div>
      </div>

      <div className="product-card-info">
        <span className="product-card-gender">{product.gender}</span>
        <Link to={`/shop/${product.slug}`} className="product-card-name">{product.name}</Link>

        {product.numReviews > 0 && (
          <div className="product-card-rating">
            <FiStar />
            <span>{Number(product.rating).toFixed(1)}</span>
            <span className="review-count">({product.numReviews})</span>
          </div>
        )}

        <div className="product-card-price">
          <span className="price-current">${product.price.toFixed(2)}</span>
          {product.comparePrice > product.price && (
            <span className="price-original">${product.comparePrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
