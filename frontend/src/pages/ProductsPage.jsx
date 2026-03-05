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
    <div className="products-page" data-testid="products-page">
      {toast && <div className="toast" data-testid="toast">{toast}</div>}

      <div className="page-header">
        <h1>Products</h1>
        <button className="btn-primary" data-testid="add-product-btn" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
          + Add Product
        </button>
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

      {loading ? (
        <div className="loading" data-testid="products-loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty" data-testid="products-empty">No products yet. Add one!</div>
      ) : (
        <div className="product-grid" data-testid="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card" data-testid={`product-card-${product.id}`}>
              <img src={product.image} alt={product.name} className="product-image" data-testid={`product-image-${product.id}`} />
              <div className="product-info">
                <span className="product-category" data-testid={`product-category-${product.id}`}>{product.category}</span>
                <h3 className="product-name" data-testid={`product-name-${product.id}`}>{product.name}</h3>
                <p className="product-desc" data-testid={`product-desc-${product.id}`}>{product.description}</p>
                <div className="product-footer">
                  <span className="product-price" data-testid={`product-price-${product.id}`}>${product.price.toFixed(2)}</span>
                  <span className={`product-stock ${product.stock === 0 ? 'out' : ''}`} data-testid={`product-stock-${product.id}`}>
                    {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
                  </span>
                </div>
                <div className="product-actions">
                  <button
                    className="btn-primary"
                    data-testid={`add-to-cart-btn-${product.id}`}
                    onClick={() => handleAdd(product)}
                    disabled={product.stock === 0}
                  >
                    Add to Cart
                  </button>
                  <button className="btn-secondary" data-testid={`edit-product-btn-${product.id}`} onClick={() => handleEdit(product)}>Edit</button>
                  <button className="btn-danger" data-testid={`delete-product-btn-${product.id}`} onClick={() => handleDelete(product.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
