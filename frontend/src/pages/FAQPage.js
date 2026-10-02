import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './StaticPages.css';

const faqs = [
  { q: 'What is FusionScent?', a: 'FusionScent is based in Ontario, Canada. We offer decants down to 10ml bottles and a subscription service, so you can explore different scents before committing to buy a full-size bottle of perfume.' },
  { q: 'Do you sell full-size bottles?', a: 'Yes, but only for our niche fragrance collection (Dubai/UAE perfumes). For decants, we offer 10ml or 30ml of designer perfumes.' },
  { q: 'Are these perfumes authentic?', a: 'Definitely — 100% authenticity. Our perfumes come from an authorized supplier.' },
  { q: 'How does the subscription work?', a: 'Our subscription service is convenient and cost-effective for enjoying a variety of fragrances. Choose your perfume and we\'ll ship your order. First month: you\'ll receive a confirmation and your order ships within 5 business days of subscribing. Second month and ongoing: your subscription renews automatically, and you can change your scent at the end of each billing cycle — orders ship within 5 business days.' },
  { q: 'Can I cancel my subscription?', a: 'Yes — to avoid being charged, cancel at least 7 days before your next billing date.' },
  { q: 'What is your return policy?', a: 'We guarantee our perfume is genuine and hand-decanted under sanitation guidelines from the original manufacturer bottle. Decants are final sale — non-refundable and non-returnable — due to personal hygiene and safety regulations, unless the item arrives damaged or defective (replaced within 30 days of delivery; email fusionscent@yahoo.com with your order number and photos). Full-size bottles can be returned only if completely unused, unopened, and the seal/cellophane is intact — contact us within 10 days of delivery to start a return. All international orders are final sale.' },
  { q: 'How does the refund process work?', a: 'Once we receive and inspect a returned item, refunds are issued to your original payment method. Processing times vary by payment provider — FusionScent is not responsible for delays caused by your bank.' },
  { q: 'What are your shipping destinations and costs?', a: 'Canada: typically around $6.99 (free for subscription orders). United States: international shipping applies, typically around $10.99.' },
  { q: 'What are your delivery times?', a: 'Standard delivery within Canada typically takes 5–10 business days after shipping, and can run longer for rural locations or around holidays. If an item is temporarily out of stock, we\'ll notify you of any delay. Packages returned due to an incorrect address are non-refundable — please keep your shipping info up to date in your account.' },
  { q: 'How do I get the 10% first-order discount?', a: 'Subscribe to our newsletter when registering your account. You will receive a discount code via email. Apply it at checkout to save 10% on your first order.' },
  { q: 'How do I track my order?', a: 'Once your order ships, log into your account and visit "My Orders" to view real-time status updates.' },
];

const FAQPage = () => {
  const [open, setOpen] = useState(null);

  return (
    <>
      <Helmet><title>FAQ - FusionScent</title></Helmet>

      <div className="page-hero" style={{ background: 'linear-gradient(135deg, var(--purple-deep), var(--purple-main))' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--purple-light)' }}>Help Center</span>
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about FusionScent</p>
        </div>
      </div>

      <section className="section">
        <div className="container-sm">
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
                  <span>{faq.q}</span>
                  {open === i ? <FiMinus style={{ color: 'var(--purple-main)', flexShrink: 0 }} /> : <FiPlus style={{ color: 'var(--purple-main)', flexShrink: 0 }} />}
                </button>
                {open === i && <div className="faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem', background: 'var(--purple-bg)', borderRadius: 'var(--radius-lg)', padding: '2.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Still have questions?</h3>
            <p style={{ color: 'var(--text-body)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Our team is happy to help. Reach out and we'll get back to you within 24 hours.</p>
            <Link to="/contact" className="btn btn-primary">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQPage;
