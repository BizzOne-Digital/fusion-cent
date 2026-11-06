import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiShoppingBag, FiHeart, FiMinus, FiPlus, FiStar, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getProductBySlug, getProductReviews } from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [variantIdx, setVariantIdx] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await getProductBySlug(slug);
        setProduct(data);
        setVariantIdx(0);
        const r = await getProductReviews(data._id);
        setReviews(r.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [slug]);

  if (loading) return <div className="spinner" style={{ marginTop: '4rem' }} />;
  if (!product) return <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}><p>Product not found.</p><Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Shop</Link></div>;

  const images = product.images?.length > 0
    ? product.images
    : [{ url: 'https://via.placeholder.com/600x600?text=FusionScent' }];

  const hasVariants = product.variants?.length > 0;
  const selected = hasVariants ? product.variants[variantIdx] : null;
  const displayPrice = selected ? selected.price : product.price;
  const displayComparePrice = selected ? selected.comparePrice : product.comparePrice;
  const displaySize = selected ? selected.size : product.size;
  const displayStock = selected ? selected.stock : product.stock;

  const discount = displayComparePrice > displayPrice
    ? Math.round((1 - displayPrice / displayComparePrice) * 100) : 0;

  return (
    <>
      <Helmet><title>{`${product.name} - FusionScent`}</title></Helmet>

      <div className="pdp-breadcrumb container">
        <Link to="/"><span>Home</span></Link> / <Link to="/shop"><span>Shop</span></Link> / <span>{product.name}</span>
      </div>

      <div className="pdp-layout container">
        {/* Images */}
        <div className="pdp-images">
          <div className="pdp-img-main">
            <img
              src={images[activeImg]?.url}
              alt={product.name}
              onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/logo.png`; }}
            />
            {discount > 0 && <span className="pdp-discount-badge">-{discount}%</span>}
          </div>
          {images.length > 1 && (
            <div className="pdp-thumbnails">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`pdp-thumb ${activeImg === i ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img.url} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pdp-info">
          <div className="pdp-badges">
            {product.isBestSeller && <span className="badge badge-gold">Best Seller</span>}
            {product.isNewArrival && <span className="badge badge-purple">New Arrival</span>}
            <span className="badge badge-purple">{product.gender}</span>
          </div>

          <h1 className="pdp-title">{product.name}</h1>

          {product.numReviews > 0 && (
            <div className="pdp-rating">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} style={{ fill: i < Math.round(product.rating) ? '#f59e0b' : 'none', color: '#f59e0b' }} />
              ))}
              <span>{Number(product.rating).toFixed(1)}</span>
              <span className="pdp-review-count">({product.numReviews} reviews)</span>
            </div>
          )}

          <div className="pdp-price">
            <span className="pdp-price-current">${displayPrice.toFixed(2)}</span>
            {displayComparePrice > displayPrice && (
              <span className="pdp-price-original">${displayComparePrice.toFixed(2)}</span>
            )}
          </div>

          <p className="pdp-desc">{product.shortDescription || product.description}</p>

          {hasVariants ? (
            <div className="pdp-size">
              <strong>Size:</strong>
              <div className="pdp-size-options">
                {product.variants.map((v, i) => (
                  <button
                    key={v.size}
                    type="button"
                    className={`pdp-size-option ${i === variantIdx ? 'active' : ''} ${v.stock === 0 ? 'disabled' : ''}`}
                    onClick={() => setVariantIdx(i)}
                    disabled={v.stock === 0}
                  >
                    <span>{v.size}</span>
                    <span className="pdp-size-option-price">${v.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : product.size && (
            <div className="pdp-size">
              <strong>Size:</strong> <span>{product.size}</span>
            </div>
          )}

          {/* Qty + Cart */}
          <div className="pdp-add-to-cart">
            <div className="qty-control">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}><FiMinus /></button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}><FiPlus /></button>
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => addToCart({ ...product, price: displayPrice, comparePrice: displayComparePrice, size: displaySize, stock: displayStock }, qty)}
              disabled={displayStock === 0}
            >
              <FiShoppingBag />
              {displayStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button className="wishlist-btn"><FiHeart /></button>
          </div>

          {displayStock > 0 && displayStock < 10 && (
            <p className="stock-warning">Only {displayStock} left in stock!</p>
          )}

          {/* Notes */}
          {(product.notes?.top?.length > 0 || product.notes?.middle?.length > 0) && (
            <div className="pdp-notes">
              <h4>Fragrance Notes</h4>
              <div className="notes-grid">
                {product.notes?.top?.length > 0 && (
                  <div><strong>Top</strong><p>{product.notes.top.join(', ')}</p></div>
                )}
                {product.notes?.middle?.length > 0 && (
                  <div><strong>Heart</strong><p>{product.notes.middle.join(', ')}</p></div>
                )}
                {product.notes?.base?.length > 0 && (
                  <div><strong>Base</strong><p>{product.notes.base.join(', ')}</p></div>
                )}
              </div>
            </div>
          )}

          <div className="pdp-perks">
            <span>🚚 Free CA shipping over $150</span>
            <span>🔒 Secure checkout</span>
            <span>✅ 100% guaranteed authentic</span>
          </div>
        </div>
      </div>

      {/* Full Description */}
      <div className="pdp-full-desc section-sm">
        <div className="container-sm">
          <h2>About This Fragrance</h2>
          <p>{product.description}</p>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="pdp-reviews section-sm">
          <div className="container-sm">
            <h2>Customer Reviews ({reviews.length})</h2>
            <div className="reviews-list">
              {reviews.map(r => (
                <div key={r._id} className="review-item">
                  <div className="review-header">
                    <div className="review-avatar">{r.user?.name?.charAt(0)}</div>
                    <div>
                      <strong>{r.user?.name}</strong>
                      <div className="stars" style={{ fontSize: '0.8rem' }}>
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} style={{ fill: i < r.rating ? '#f59e0b' : 'none', color: '#f59e0b' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;
