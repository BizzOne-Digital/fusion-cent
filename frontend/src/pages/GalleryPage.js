import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getProducts } from '../utils/api';
import './GalleryPage.css';

const placeholders = [
  { emoji: '🌸', label: 'Rose Collection' },
  { emoji: '🌿', label: 'Fresh & Green' },
  { emoji: '💜', label: 'Velvet Oud' },
  { emoji: '🌊', label: 'Ocean Breeze' },
  { emoji: '🔥', label: 'Noir Intense' },
  { emoji: '🍊', label: 'Citrus Burst' },
  { emoji: '🌹', label: 'Blush Bloom' },
  { emoji: '✨', label: 'Pure Essence' },
  { emoji: '🍃', label: 'Soft Musk' },
];

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    getProducts({ limit: 20 })
      .then(r => {
        const imgs = [];
        r.data.products.forEach(p => {
          p.images?.forEach(img => imgs.push({ url: img.url, label: p.name }));
        });
        setImages(imgs);
      })
      .catch(() => {});
  }, []);

  const items = images.length > 0
    ? images
    : placeholders.map(p => ({ url: null, ...p }));

  const prev = () => setLightbox(l => (l - 1 + items.length) % items.length);
  const next = () => setLightbox(l => (l + 1) % items.length);

  return (
    <>
      <Helmet><title>Gallery - FusionScent</title></Helmet>

      <div className="page-hero" style={{ background: 'linear-gradient(135deg, var(--purple-deep), var(--purple-main))' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--purple-light)' }}>Visual Journey</span>
          <h1>Our Gallery</h1>
          <p>A glimpse into the world of FusionScent</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="gallery-masonry">
            {items.map((item, i) => (
              <div
                key={i}
                className={`gallery-tile ${i % 5 === 0 ? 'tile-large' : ''}`}
                onClick={() => setLightbox(i)}
              >
                {item.url ? (
                  <img src={item.url} alt={item.label} loading="lazy" />
                ) : (
                  <div className="gallery-placeholder">
                    <span>{item.emoji}</span>
                    <p>{item.label}</p>
                  </div>
                )}
                <div className="gallery-overlay">
                  <span>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lb-close"><FiX /></button>
          <button className="lb-nav lb-prev" onClick={e => { e.stopPropagation(); prev(); }}><FiChevronLeft /></button>
          <div className="lb-content" onClick={e => e.stopPropagation()}>
            {items[lightbox].url ? (
              <img src={items[lightbox].url} alt={items[lightbox].label} />
            ) : (
              <div className="lb-placeholder">
                <span>{items[lightbox].emoji}</span>
                <p>{items[lightbox].label}</p>
              </div>
            )}
            <p className="lb-label">{items[lightbox].label}</p>
          </div>
          <button className="lb-nav lb-next" onClick={e => { e.stopPropagation(); next(); }}><FiChevronRight /></button>
        </div>
      )}
    </>
  );
};

export default GalleryPage;
