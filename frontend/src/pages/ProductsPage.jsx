import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../api';
import ProductForm from '../components/ProductForm';
import ReviewsModal from '../components/ReviewsModal';
import StarRating from '../components/StarRating';
import './ProductsPage.css';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Footwear', 'Kitchen', 'Books', 'Sports', 'Toys', 'General'];

export default function ProductsPage({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('default');

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    const [prods, allReviews] = await Promise.all([
      api.getProducts(),
      // fetch reviews for all products in parallel
      api.getProducts().then(ps =>
        Promise.all(ps.map(p => api.getReviews(p.id).then(rs => rs.map(r => ({ ...r, productId: p.id })))))
          .then(groups => groups.flat())
      ),
    ]);
    setProducts(prods);
    setReviews(allReviews);
    setLoading(false);
  };

  const avgRating = (productId) => {
    const rs = reviews.filter(r => r.productId === productId);
    if (!rs.length) return null;
    return rs.reduce((sum, r) => sum + r.rating, 0) / rs.length;
  };

  const reviewCount = (productId) => reviews.filter(r => r.productId === productId).length;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSave = async (data) => {
    if (editingProduct) {
      await api.updateProduct(editingProduct.id, data);
      showToast('Product updated');
    } else {
      await api.createProduct(data);
      showToast('Product created');
    }
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.deleteProduct(id);
    showToast('Product deleted');
    loadProducts();
  };

  const handleReviewClose = () => {
    setReviewProduct(null);
    // Refresh reviews after modal closes in case new one was added
    Promise.all(products.map(p => api.getReviews(p.id).then(rs => rs.map(r => ({ ...r, productId: p.id })))))
      .then(groups => setReviews(groups.flat()));
  };

  const slug = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
    if (category !== 'All') list = list.filter(p => p.category === category);
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'rating') list.sort((a, b) => (avgRating(b.id) || 0) - (avgRating(a.id) || 0));
    return list;
  }, [products, search, category, sort, reviews]);

  const hasFilters = search || category !== 'All' || sort !== 'default';

  return (
    <div className="products-page" data-testid="products-page">
      {toast && <div className="toast" data-testid="toast">{toast}</div>}

      <div className="page-header">
        <h1>Products</h1>
        <button className="btn-primary" data-testid="add-product-btn" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
          + Add Product
        </button>
      </div>

      <div className="filter-bar" data-testid="filter-bar">
        <input
          className="search-input"
          data-testid="search-input"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select data-testid="category-filter" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select data-testid="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A–Z</option>
          <option value="rating">Top Rated</option>
        </select>
        {hasFilters && (
          <button className="btn-secondary" data-testid="clear-filters-btn" onClick={() => { setSearch(''); setCategory('All'); setSort('default'); }}>
            Clear
          </button>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" data-testid="product-modal-overlay" onClick={() => { setShowForm(false); setEditingProduct(null); }}>
          <div className="modal" data-testid="product-modal" onClick={e => e.stopPropagation()}>
            <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <ProductForm
              initial={editingProduct}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingProduct(null); }}
            />
          </div>
        </div>
      )}

      {reviewProduct && (
        <ReviewsModal product={reviewProduct} onClose={handleReviewClose} />
      )}

      {loading ? (
        <div className="loading" data-testid="products-loading">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="empty" data-testid="products-empty">
          {hasFilters ? 'No products match your filters.' : 'No products yet. Add one!'}
        </div>
      ) : (
        <div className="product-grid" data-testid="product-grid">
          {filtered.map(product => {
            const s = slug(product.name);
            const avg = avgRating(product.id);
            const count = reviewCount(product.id);
            return (
              <div key={product.id} className="product-card" data-testid={`product-card-${s}`}>
                <img src={product.image} alt={product.name} className="product-image" data-testid={`product-image-${s}`} />
                <div className="product-info">
                  <span className="product-category" data-testid={`product-category-${s}`}>{product.category}</span>
                  <h3 className="product-name" data-testid={`product-name-${s}`}>{product.name}</h3>
                  <p className="product-desc" data-testid={`product-desc-${s}`}>{product.description}</p>

                  <button
                    className="rating-row"
                    data-testid={`reviews-btn-${s}`}
                    onClick={() => setReviewProduct(product)}
                  >
                    {avg !== null ? (
                      <>
                        <StarRating value={avg} size={14} />
                        <span className="rating-count" data-testid={`rating-avg-${s}`}>{avg.toFixed(1)}</span>
                        <span className="rating-count">({count})</span>
                      </>
                    ) : (
                      <span className="no-reviews">No reviews yet</span>
                    )}
                  </button>

                  <div className="product-footer">
                    <span className="product-price" data-testid={`product-price-${s}`}>${product.price.toFixed(2)}</span>
                    <span className={`product-stock ${product.stock === 0 ? 'out' : ''}`} data-testid={`product-stock-${s}`}>
                      {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
                    </span>
                  </div>
                  <div className="product-actions">
                    <button
                      className="btn-primary"
                      data-testid={`add-to-cart-btn-${s}`}
                      onClick={() => { addToCart(product); showToast(`"${product.name}" added to cart`); }}
                      disabled={product.stock === 0}
                    >
                      Add to Cart
                    </button>
                    <button className="btn-secondary" data-testid={`edit-product-btn-${s}`} onClick={() => { setEditingProduct(product); setShowForm(true); }}>Edit</button>
                    <button className="btn-danger" data-testid={`delete-product-btn-${s}`} onClick={() => handleDelete(product.id)}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
