import React, { useState, useEffect } from 'react';
import { api } from '../api';
import StarRating from './StarRating';
import './ReviewsModal.css';

export default function ReviewsModal({ product, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ author: '', rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getReviews(product.id).then(data => {
      setReviews(data);
      setLoading(false);
    });
  }, [product.id]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rating) return;
    setSubmitting(true);
    const review = await api.createReview(product.id, form);
    setReviews(prev => [...prev, review]);
    setForm({ author: '', rating: 0, comment: '' });
    setSubmitting(false);
  };

  const slug = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <div className="modal-overlay" data-testid={`reviews-modal-overlay-${slug}`} onClick={onClose}>
      <div className="modal reviews-modal" data-testid={`reviews-modal-${slug}`} onClick={e => e.stopPropagation()}>
        <div className="reviews-modal-header">
          <div>
            <h2 data-testid={`reviews-modal-title-${slug}`}>{product.name}</h2>
            {avgRating && (
              <div className="reviews-avg" data-testid={`reviews-avg-${slug}`}>
                <StarRating value={parseFloat(avgRating)} size={16} />
                <span>{avgRating} avg · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
          <button className="close-btn" data-testid={`reviews-modal-close-${slug}`} onClick={onClose}>✕</button>
        </div>

        <div className="reviews-list" data-testid={`reviews-list-${slug}`}>
          {loading ? (
            <div className="reviews-loading" data-testid="reviews-loading">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="reviews-empty" data-testid={`reviews-empty-${slug}`}>No reviews yet. Be the first!</div>
          ) : (
            reviews.map((review, i) => (
              <div key={review.id} className="review-item" data-testid={`review-item-${slug}-${i}`}>
                <div className="review-item-header">
                  <span className="review-author" data-testid={`review-author-${slug}-${i}`}>{review.author}</span>
                  <StarRating value={review.rating} size={14} />
                  <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                {review.comment && (
                  <p className="review-comment" data-testid={`review-comment-${slug}-${i}`}>{review.comment}</p>
                )}
              </div>
            ))
          )}
        </div>

        <form className="review-form" data-testid={`review-form-${slug}`} onSubmit={handleSubmit}>
          <h3>Leave a Review</h3>
          <div className="form-group">
            <label>Your Name *</label>
            <input
              data-testid={`review-form-author-${slug}`}
              value={form.author}
              onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
              required
              placeholder="Jane Smith"
            />
          </div>
          <div className="form-group">
            <label>Rating *</label>
            <StarRating value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} size={28} />
          </div>
          <div className="form-group">
            <label>Comment</label>
            <textarea
              data-testid={`review-form-comment-${slug}`}
              value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              rows={3}
              placeholder="What did you think?"
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            data-testid={`review-form-submit-${slug}`}
            disabled={submitting || !form.author || !form.rating}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
