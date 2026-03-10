import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import './CheckoutPage.css';

export default function CheckoutPage({ cart, clearCart }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '4242 4242 4242 4242',
    cardExpiry: '12/27',
    cardCvc: '123',
    paymentMethod: 'credit_card',
  });
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [discountInput, setDiscountInput] = useState('');
  const [discount, setDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const discountAmount = discount
    ? discount.type === 'percent'
      ? subtotal * (discount.value / 100)
      : Math.min(discount.value, subtotal)
    : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) return;
    setDiscountLoading(true);
    setDiscountError('');
    const result = await api.validateDiscount(discountInput.trim());
    setDiscountLoading(false);
    if (result.error) {
      setDiscountError(result.error);
      setDiscount(null);
    } else {
      setDiscount(result);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscount(null);
    setDiscountInput('');
    setDiscountError('');
  };

  if (cart.length === 0 && !result) {
    return (
      <div className="checkout-empty" data-testid="checkout-empty">
        <h2>Nothing to checkout</h2>
        <Link to="/"><button className="btn-primary" data-testid="checkout-browse-btn">Browse Products</button></Link>
      </div>
    );
  }

  if (result) {
    const success = result.paymentStatus === 'success';
    return (
      <div className={`checkout-result ${success ? 'success' : 'failure'}`} data-testid={`checkout-result-${success ? 'success' : 'failure'}`}>
        <div className="result-icon">{success ? '✓' : '✗'}</div>
        <h2 data-testid="checkout-result-heading">{success ? 'Order Confirmed!' : 'Payment Failed'}</h2>
        {success ? (
          <>
            <p>Thank you, <strong>{result.customer.name}</strong>! Your order has been placed.</p>
            <p className="order-id" data-testid="checkout-order-id">Order ID: <code>{result.id}</code></p>
            {result.discountCode && (
              <p className="order-discount" data-testid="checkout-order-discount">
                Discount ({result.discountCode}): -${result.discountAmount.toFixed(2)}
              </p>
            )}
            <p className="order-total" data-testid="checkout-order-total">Total charged: <strong>${result.total.toFixed(2)}</strong></p>
            <div className="result-actions">
              <button className="btn-primary" data-testid="view-order-btn" onClick={() => navigate(`/orders/${result.id}`)}>
                View Order
              </button>
              <button className="btn-secondary" data-testid="continue-shopping-btn" onClick={() => navigate('/')}>
                Continue Shopping
              </button>
            </div>
          </>
        ) : (
          <>
            <p>Your payment could not be processed. Please try again.</p>
            <button className="btn-primary" data-testid="try-again-btn" onClick={() => setResult(null)}>Try Again</button>
          </>
        )}
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const order = await api.checkout({
        items: cart.map(i => ({ productId: i.productId, quantity: i.quantity })),
        customer: { name: form.name, email: form.email, address: `${form.address}, ${form.city} ${form.zip}` },
        paymentMethod: form.paymentMethod,
        discountCode: discount ? discount.code : undefined,
      });
      if (order.error) {
        alert(`Checkout error: ${order.error}`);
        return;
      }
      if (order.paymentStatus === 'success') clearCart();
      setResult(order);
    } catch (err) {
      alert('Checkout failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-page" data-testid="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" data-testid="checkout-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <h2>Customer Info</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input data-testid="checkout-name" value={form.name} onChange={set('name')} required placeholder="Jane Smith" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input data-testid="checkout-email" type="email" value={form.email} onChange={set('email')} required placeholder="jane@example.com" />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Shipping Address</h2>
            <div className="form-group">
              <label>Street Address</label>
              <input data-testid="checkout-address" value={form.address} onChange={set('address')} placeholder="123 Main St" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input data-testid="checkout-city" value={form.city} onChange={set('city')} placeholder="New York" />
              </div>
              <div className="form-group">
                <label>ZIP</label>
                <input data-testid="checkout-zip" value={form.zip} onChange={set('zip')} placeholder="10001" />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Payment</h2>
            <div className="form-group">
              <label>Payment Method</label>
              <select data-testid="checkout-payment-method" value={form.paymentMethod} onChange={set('paymentMethod')}>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            {form.paymentMethod !== 'paypal' && (
              <>
                <div className="form-group">
                  <label>Card Number</label>
                  <input data-testid="checkout-card-number" value={form.cardNumber} onChange={set('cardNumber')} placeholder="4242 4242 4242 4242" maxLength={19} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry (MM/YY)</label>
                    <input data-testid="checkout-card-expiry" value={form.cardExpiry} onChange={set('cardExpiry')} placeholder="12/27" maxLength={5} />
                  </div>
                  <div className="form-group">
                    <label>CVC</label>
                    <input data-testid="checkout-card-cvc" value={form.cardCvc} onChange={set('cardCvc')} placeholder="123" maxLength={4} />
                  </div>
                </div>
              </>
            )}
            <div className="fake-notice">Fake payment — no real charge will occur</div>
          </section>

          <button type="submit" className="btn-success place-order-btn" data-testid="place-order-btn" disabled={processing}>
            {processing ? 'Processing...' : `Place Order · $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="order-review" data-testid="order-review">
          <h2>Order Review</h2>
          <div className="review-items" data-testid="review-items">
            {cart.map(item => (
              <div key={item.productId} className="review-item" data-testid={`review-item-${item.productId}`}>
                <span className="review-name">{item.name} <span className="review-qty">×{item.quantity}</span></span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="discount-section" data-testid="discount-section">
            {discount ? (
              <div className="discount-applied" data-testid="discount-applied">
                <span className="discount-tag" data-testid="discount-tag">
                  {discount.code} — {discount.description}
                </span>
                <button className="discount-remove" data-testid="discount-remove-btn" onClick={handleRemoveDiscount}>✕</button>
              </div>
            ) : (
              <div className="discount-input-row">
                <input
                  className="discount-input"
                  data-testid="discount-code-input"
                  placeholder="Discount code"
                  value={discountInput}
                  onChange={e => { setDiscountInput(e.target.value); setDiscountError(''); }}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApplyDiscount())}
                />
                <button
                  type="button"
                  className="btn-secondary discount-apply-btn"
                  data-testid="discount-apply-btn"
                  onClick={handleApplyDiscount}
                  disabled={discountLoading || !discountInput.trim()}
                >
                  {discountLoading ? '...' : 'Apply'}
                </button>
              </div>
            )}
            {discountError && <p className="discount-error" data-testid="discount-error">{discountError}</p>}
          </div>

          {discount && (
            <div className="review-row" data-testid="review-subtotal-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          )}
          {discount && (
            <div className="review-row discount-row" data-testid="review-discount-row">
              <span>Discount</span>
              <span data-testid="review-discount-amount">-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="review-total" data-testid="review-total">
            <span>Total</span>
            <span data-testid="review-total-amount">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
