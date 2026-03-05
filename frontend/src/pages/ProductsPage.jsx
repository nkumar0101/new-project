import React, { useState, useEffect } from 'react';
import { api } from '../api';
import ProductForm from '../components/ProductForm';
import './ProductsPage.css';

export default function ProductsPage({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await api.getProducts();
    setProducts(data);
    setLoading(false);
  };

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

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAdd = (product) => {
    addToCart(product);
    showToast(`"${product.name}" added to cart`);
  };

  return (
    <div className="products-page">
      {toast && <div className="toast">{toast}</div>}

      <div className="page-header">
        <h1>Products</h1>
        <button className="btn-primary" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
          + Add Product
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => { setShowForm(false); setEditingProduct(null); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <ProductForm
              initial={editingProduct}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingProduct(null); }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty">No products yet. Add one!</div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <span className={`product-stock ${product.stock === 0 ? 'out' : ''}`}>
                    {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
                  </span>
                </div>
                <div className="product-actions">
                  <button
                    className="btn-primary"
                    onClick={() => handleAdd(product)}
                    disabled={product.stock === 0}
                  >
                    Add to Cart
                  </button>
                  <button className="btn-secondary" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(product.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
