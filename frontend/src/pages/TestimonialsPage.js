import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiStar } from 'react-icons/fi';
import './StaticPages.css';

const reviews = [
  { name: 'Sarah K.', city: 'Toronto', rating: 5, date: 'Aug 2026', comment: 'The best mini perfume I\'ve ever used! Long-lasting and absolutely worth it. The refillable design is genius — I\'ve already refilled it twice and it still looks brand new.' },
  { name: 'James T.', city: 'Vancouver', rating: 5, date: 'Jul 2026', comment: 'Elegant packaging and amazing fragrance. Highly recommended. Bought the Discovery Set for my wife and she absolutely loves it. Will be ordering again.' },
  { name: 'Sophia L.', city: 'Montreal', rating: 5, date: 'Jul 2026', comment: 'FusionScent has become my go-to brand for every occasion. The scents are sophisticated but not overpowering. Perfect for the office.' },
  { name: 'Ahmed R.', city: 'Calgary', rating: 4, date: 'Jun 2026', comment: 'Great quality and fast shipping. The bottle fits perfectly in my suit pocket. Noir Intense is my new signature scent. Highly recommend to anyone who wants to smell premium without breaking the bank.' },
  { name: 'Priya M.', city: 'Ottawa', rating: 5, date: 'Jun 2026', comment: 'I love how portable these are! I keep one in my gym bag, one in my car, and one at work. The refillable system is also very eco-friendly, which I appreciate.' },
  { name: 'Lucas B.', city: 'Edmonton', rating: 5, date: 'May 2026', comment: 'Ordered the Collection Set as a gift. The packaging was beautiful and the scents are divine. My sister was over the moon. Excellent customer service too — they answered my questions within an hour.' },
];

const StarRating = ({ n }) => (
  <div className="stars" style={{ marginBottom: '0.75rem' }}>
    {[...Array(5)].map((_, i) => (
      <FiStar key={i} style={{ fill: i < n ? '#f59e0b' : 'none', color: '#f59e0b', fontSize: '0.9rem' }} />
    ))}
  </div>
);

const TestimonialsPage = () => (
  <>
    <Helmet><title>Testimonials - FusionScent</title></Helmet>

    <div className="page-hero" style={{ background: 'linear-gradient(135deg, var(--purple-deep), var(--purple-main))' }}>
      <div className="container">
        <span className="section-label" style={{ color: 'var(--purple-light)' }}>Real Stories</span>
        <h1>What Our Customers Say</h1>
        <p>Trusted by thousands of fragrance lovers across Canada</p>
      </div>
    </div>

    <section className="section" style={{ background: 'var(--purple-bg)' }}>
      <div className="container">
        <div className="stats-row">
          {[
            { value: '4.9', label: 'Average Rating' },
            { value: '10,000+', label: 'Happy Customers' },
            { value: '98%', label: 'Would Recommend' },
            { value: '5★', label: 'Review Score' },
          ].map(s => (
            <div key={s.label} className="stat-box">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="testimonials-page-grid">
          {reviews.map((r, i) => (
            <div key={i} className="testimonial-card card">
              <div className="testimonial-quote">"</div>
              <StarRating n={r.rating} />
              <p className="testimonial-text">{r.comment}</p>
              <div className="testimonial-author">
                <div className="author-avatar">{r.name.charAt(0)}</div>
                <div>
                  <strong>{r.name}</strong>
                  <span>{r.city} · {r.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default TestimonialsPage;
