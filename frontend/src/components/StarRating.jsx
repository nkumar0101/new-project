import React from 'react';

export default function StarRating({ value, onChange, size = 18 }) {
  const stars = [1, 2, 3, 4, 5];

  if (onChange) {
    return (
      <div className="star-rating interactive" data-testid="star-rating-input">
        {stars.map(s => (
          <span
            key={s}
            data-testid={`star-input-${s}`}
            onClick={() => onChange(s)}
            style={{ fontSize: size, cursor: 'pointer', color: s <= value ? '#f59e0b' : '#d1d5db' }}
          >★</span>
        ))}
      </div>
    );
  }

  return (
    <div className="star-rating" data-testid="star-rating-display">
      {stars.map(s => (
        <span key={s} style={{ fontSize: size, color: s <= Math.round(value) ? '#f59e0b' : '#d1d5db' }}>★</span>
      ))}
    </div>
  );
}
