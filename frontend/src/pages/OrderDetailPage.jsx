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

  if (loading) return <div className="loading">Loading order...</div>;
  if (!order || order.error) return <div className="loading">Order not found.</div>;

  const style = STATUS_COLORS[order.status] || { bg: '#f3f4f6', color: '#374151' };

  return (
    <div className="order-detail">
      <div className="detail-header">
        <Link to="/orders" className="back-link">← Back to Orders</Link>
        <h1>Order Details</h1>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h2>Order Info</h2>
          <div className="info-rows">
            <div className="info-row">
              <span>Order ID</span>
              <code>{order.id}</code>
            </div>
            <div className="info-row">
              <span>Status</span>
              <span className="status-pill" style={{ background: style.bg, color: style.color }}>
                {order.status.replace('_', ' ')}
              </span>
            </div>
            <div className="info-row">
              <span>Payment</span>
              <span className={`payment-status ${order.paymentStatus}`}>
                {order.paymentStatus} ({order.paymentMethod.replace('_', ' ')})
              </span>
            </div>
            <div className="info-row">
              <span>Date</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <h2>Customer</h2>
          <div className="info-rows">
            <div className="info-row">
              <span>Name</span>
              <span>{order.customer.name}</span>
            </div>
            <div className="info-row">
              <span>Email</span>
              <span>{order.customer.email}</span>
            </div>
            {order.customer.address && (
              <div className="info-row">
                <span>Address</span>
                <span>{order.customer.address}</span>
              </div>
            )}
          </div>
        </div>

        <div className="detail-card items-card">
          <h2>Items</h2>
          <table className="items-table">
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
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td><strong>${item.subtotal.toFixed(2)}</strong></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="total-label">Total</td>
                <td className="total-value">${order.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
