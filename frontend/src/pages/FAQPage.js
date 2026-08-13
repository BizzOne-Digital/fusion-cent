import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './StaticPages.css';

const faqs = [
  { q: 'What size are FusionScent perfume bottles?', a: 'Our signature mini perfume bottles are 8ml — compact enough to fit in any pocket, purse, or carry-on bag, but generous enough to last weeks of daily use.' },
  { q: 'Are the bottles really refillable?', a: 'Yes! Every FusionScent bottle is designed to be refilled. Simply purchase a refill of your favorite scent and snap it in. This reduces plastic waste and saves you money in the long run.' },
  { q: 'How long does an 8ml bottle last?', a: 'With average daily use of 3–4 sprays, an 8ml bottle typically lasts 2–4 weeks. The longevity also depends on the fragrance concentration — our Eau de Parfum formulas tend to last longer on the skin.' },
  { q: 'Do you offer free shipping?', a: 'Yes! We offer free shipping on all orders over $100. Subscribers also get free shipping on their first order regardless of amount, along with a 10% discount.' },
  { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery for unopened, unused products in original packaging. If you received a damaged or incorrect item, we will replace it free of charge.' },
  { q: 'How do I get the 10% first-order discount?', a: 'Subscribe to our newsletter when registering your account. You will receive a discount code via email. Apply it at checkout to save 10% on your first order, plus get free shipping.' },
  { q: 'Do you ship internationally?', a: 'Yes, we ship worldwide. International shipping rates and delivery times vary by destination. You will see the exact shipping cost at checkout before you confirm your order.' },
  { q: 'Are your fragrances suitable for sensitive skin?', a: 'Our fragrances are crafted with high-quality ingredients and are generally suitable for most skin types. If you have known fragrance sensitivities or allergies, we recommend checking the ingredient list or consulting with us before purchase.' },
  { q: 'Can I buy in bulk or wholesale?', a: 'Yes, we offer bulk and wholesale pricing for retailers and events. Contact us at fusion.scent@yahoo.com with details about your requirements and we will get back to you within 48 hours.' },
  { q: 'How do I track my order?', a: 'Once your order ships, you will receive a confirmation email with a tracking number. You can also log into your account and visit "My Orders" to view real-time status updates.' },
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
