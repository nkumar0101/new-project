import React from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css';

export default function CartPage({ cart, updateCartItem }) {
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started.</p>
        <Link to="/"><button className="btn-primary">Browse Products</button></Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <span className="cart-item-price">${item.price.toFixed(2)} each</span>
              </div>
              <div className="cart-item-controls">
                <button
                  className="qty-btn"
                  onClick={() => updateCartItem(item.productId, item.quantity - 1)}
                >−</button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateCartItem(item.productId, item.quantity + 1)}
                >+</button>
                <span className="item-subtotal">${(item.price * item.quantity).toFixed(2)}</span>
                <button
                  className="btn-danger remove-btn"
                  onClick={() => updateCartItem(item.productId, 0)}
                >Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-rows">
            {cart.map(item => (
              <div key={item.productId} className="summary-row">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout">
            <button className="btn-success checkout-btn">Proceed to Checkout</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
