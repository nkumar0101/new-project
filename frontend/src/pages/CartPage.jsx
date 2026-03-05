import React from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css';

export default function CartPage({ cart, updateCartItem }) {
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="cart-empty" data-testid="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started.</p>
        <Link to="/"><button className="btn-primary" data-testid="cart-browse-btn">Browse Products</button></Link>
      </div>
    );
  }

  return (
    <div className="cart-page" data-testid="cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-layout">
        <div className="cart-items" data-testid="cart-items">
          {cart.map(item => (
            <div key={item.productId} className="cart-item" data-testid={`cart-item-${item.productId}`}>
              <div className="cart-item-info">
                <h3 data-testid={`cart-item-name-${item.productId}`}>{item.name}</h3>
                <span className="cart-item-price" data-testid={`cart-item-price-${item.productId}`}>${item.price.toFixed(2)} each</span>
              </div>
              <div className="cart-item-controls">
                <button
                  className="qty-btn"
                  data-testid={`cart-item-decrement-${item.productId}`}
                  onClick={() => updateCartItem(item.productId, item.quantity - 1)}
                >−</button>
                <span className="qty-value" data-testid={`cart-item-quantity-${item.productId}`}>{item.quantity}</span>
                <button
                  className="qty-btn"
                  data-testid={`cart-item-increment-${item.productId}`}
                  onClick={() => updateCartItem(item.productId, item.quantity + 1)}
                >+</button>
                <span className="item-subtotal" data-testid={`cart-item-subtotal-${item.productId}`}>${(item.price * item.quantity).toFixed(2)}</span>
                <button
                  className="btn-danger remove-btn"
                  data-testid={`cart-item-remove-${item.productId}`}
                  onClick={() => updateCartItem(item.productId, 0)}
                >Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary" data-testid="cart-summary">
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
              <span data-testid="cart-total">${total.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout">
            <button className="btn-success checkout-btn" data-testid="proceed-to-checkout-btn">Proceed to Checkout</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
