import React, { useState, useEffect } from 'react';
import { FiCheck, FiTrash2, FiStar } from 'react-icons/fi';
import { getReviews, approveReview } from '../utils/api';
import toast from 'react-hot-toast';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try { const { data } = await getReviews(); setReviews(data); }
    catch { toast.error('Failed to load reviews'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try { await approveReview(id); toast.success('Review approved'); load(); }
    catch { toast.error('Failed to approve'); }
  };

  const filtered = filter === 'all' ? reviews : filter === 'pending' ? reviews.filter(r => !r.isApproved) : reviews.filter(r => r.isApproved);

  return (
    <div>
      <div className="adm-page-header">
        <div><h1>Reviews</h1><p>{reviews.filter(r => !r.isApproved).length} pending approval</p></div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['all', 'pending', 'approved'].map(f => (
          <button key={f} className={`adm-btn adm-btn-sm ${filter === f ? 'adm-btn-primary' : 'adm-btn-outline'}`}
            onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      {loading ? <div className="adm-spinner" /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.length === 0 && (
            <div className="adm-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-gray-400)' }}>No reviews found</div>
          )}
          {filtered.map(review => (
            <div key={review._id} className="adm-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--adm-purple-main)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                {review.user?.name?.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.9rem' }}>{review.user?.name}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--adm-gray-500)' }}>on <em>{review.product?.name}</em></span>
                  <div style={{ display: 'flex', color: '#f59e0b', fontSize: '0.8rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} style={{ fill: i < review.rating ? '#f59e0b' : 'none' }} />
                    ))}
                  </div>
                  <span className={`adm-status-badge ${review.isApproved ? 'adm-status-delivered' : 'adm-status-pending'}`}>
                    {review.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--adm-gray-700)', lineHeight: 1.6 }}>{review.comment}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--adm-gray-400)', marginTop: '0.4rem' }}>{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
              {!review.isApproved && (
                <button className="adm-btn adm-btn-success adm-btn-sm" onClick={() => handleApprove(review._id)}>
                  <FiCheck /> Approve
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
