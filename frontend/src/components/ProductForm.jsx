import React, { useState } from 'react';
import './ProductForm.css';

export default function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    price: initial?.price || '',
    stock: initial?.stock ?? '',
    category: initial?.category || 'General',
    image: initial?.image || '',
  });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) });
  };

  return (
    <form className="product-form" data-testid="product-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Product Name *</label>
        <input data-testid="product-form-name" value={form.name} onChange={set('name')} required placeholder="e.g. Wireless Headphones" />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea data-testid="product-form-description" value={form.description} onChange={set('description')} rows={3} placeholder="Brief description..." />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Price ($) *</label>
          <input data-testid="product-form-price" type="number" value={form.price} onChange={set('price')} required min="0" step="0.01" placeholder="0.00" />
        </div>
        <div className="form-group">
          <label>Stock</label>
          <input data-testid="product-form-stock" type="number" value={form.stock} onChange={set('stock')} min="0" placeholder="0" />
        </div>
      </div>
      <div className="form-group">
        <label>Category</label>
        <select data-testid="product-form-category" value={form.category} onChange={set('category')}>
          {['General', 'Electronics', 'Clothing', 'Footwear', 'Kitchen', 'Books', 'Sports', 'Toys'].map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Image URL</label>
        <input data-testid="product-form-image" value={form.image} onChange={set('image')} placeholder="https://..." />
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" data-testid="product-form-cancel" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" data-testid="product-form-submit">
          {initial ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
