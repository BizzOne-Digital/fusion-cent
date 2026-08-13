import React, { useState, useEffect } from 'react';
import './AnnouncementBar.css';

const messages = [
  '🚚 Free Shipping on Orders Over $100',
  '🎁 Subscribe & Get 10% Off Your First Order',
  '✨ Mini Refillable Perfumes — Luxury on the Go',
  '🌿 Sustainable. Portable. Luxurious.',
];

const AnnouncementBar = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % messages.length), 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="announcement-bar">
      <span className="announcement-text">{messages[idx]}</span>
    </div>
  );
};

export default AnnouncementBar;
