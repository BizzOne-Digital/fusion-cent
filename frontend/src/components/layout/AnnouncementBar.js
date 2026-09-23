import React, { useState, useEffect } from 'react';
import './AnnouncementBar.css';

const messages = [
  '🚚 Free Canada Shipping on Orders Over $150',
  '🎁 Subscribe & Get 10% Off Your First Order',
  '✨ Premium Perfume Decants — Luxury on the Go',
  '✅ 100% Guaranteed Authenticity & Secure Ordering',
];

const AnnouncementBar = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % messages.length), 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="announcement-bar">
      <span className="announcement-region">🇨🇦 CA</span>
      <span className="announcement-text">{messages[idx]}</span>
    </div>
  );
};

export default AnnouncementBar;
