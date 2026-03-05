import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import './OrderDetailPage.css';

const STATUS_COLORS = {
  confirmed: { bg: '#d1fae5', color: '#065f46' },
  payment_failed: { bg: '#fee2e2', color: '#991b1b' },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrder(id).then(data => { setOrder(data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="loading" data-testid="order-detail-loading">Loading order...</div>;
  if (!order || order.error) return <div className="loading" data-testid="order-detail-not-found">Order not found.</div>;

  const style = STATUS_COLORS[order.status] || { bg: '#f3f4f6', color: '#374151' };

  return (
    <div className="order-detail" data-testid="order-detail">
      <div className="detail-header">
        <Link to="/orders" className="back-link" data-testid="order-detail-back">← Back to Orders</Link>
        <h1>Order Details</h1>
      </div>

      <div className="detail-grid">
        <div className="detail-card" data-testid="order-info-card">
          <h2>Order Info</h2>
          <div className="info-rows">
            <div className="info-row">
              <span>Order ID</span>
              <code data-testid="order-detail-id">{order.id}</code>
            </div>
            <div className="info-row">
              <span>Status</span>
              <span className="status-pill" data-testid="order-detail-status" style={{ background: style.bg, color: style.color }}>
                {order.status.replace('_', ' ')}
              </span>
            </div>
            <div className="info-row">
              <span>Payment</span>
              <span className={`payment-status ${order.paymentStatus}`} data-testid="order-detail-payment">
                {order.paymentStatus} ({order.paymentMethod.replace('_', ' ')})
              </span>
            </div>
            <div className="info-row">
              <span>Date</span>
              <span data-testid="order-detail-date">{new Date(order.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="detail-card" data-testid="order-customer-card">
          <h2>Customer</h2>
          <div className="info-rows">
            <div className="info-row">
              <span>Name</span>
              <span data-testid="order-detail-customer-name">{order.customer.name}</span>
            </div>
            <div className="info-row">
              <span>Email</span>
              <span data-testid="order-detail-customer-email">{order.customer.email}</span>
            </div>
            {order.customer.address && (
              <div className="info-row">
                <span>Address</span>
                <span data-testid="order-detail-customer-address">{order.customer.address}</span>
              </div>
            )}
          </div>
        </div>

        <div className="detail-card items-card" data-testid="order-items-card">
          <h2>Items</h2>
          <table className="items-table" data-testid="order-items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} data-testid={`order-item-row-${i}`}>
                  <td data-testid={`order-item-name-${i}`}>{item.name}</td>
                  <td data-testid={`order-item-price-${i}`}>${item.price.toFixed(2)}</td>
                  <td data-testid={`order-item-qty-${i}`}>{item.quantity}</td>
                  <td data-testid={`order-item-subtotal-${i}`}><strong>${item.subtotal.toFixed(2)}</strong></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="total-label">Total</td>
                <td className="total-value" data-testid="order-detail-total">${order.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
