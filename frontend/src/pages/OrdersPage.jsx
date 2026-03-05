import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import './OrdersPage.css';

const STATUS_COLORS = {
  confirmed: { bg: '#d1fae5', color: '#065f46' },
  payment_failed: { bg: '#fee2e2', color: '#991b1b' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders().then(data => {
      setOrders([...data].reverse());
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading" data-testid="orders-loading">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="orders-empty" data-testid="orders-empty">
        <div style={{ fontSize: 56, marginBottom: 12 }}>📦</div>
        <h2>No orders yet</h2>
        <p>Place an order to see it here.</p>
        <Link to="/"><button className="btn-primary" data-testid="orders-shop-btn">Shop Now</button></Link>
      </div>
    );
  }

  return (
    <div className="orders-page" data-testid="orders-page">
      <h1>Orders</h1>
      <div className="orders-list" data-testid="orders-list">
        {orders.map(order => {
          const style = STATUS_COLORS[order.status] || { bg: '#f3f4f6', color: '#374151' };
          return (
            <Link key={order.id} to={`/orders/${order.id}`} className="order-card" data-testid={`order-card-${order.id}`}>
              <div className="order-card-top">
                <div>
                  <span className="order-id" data-testid={`order-id-${order.id}`}>#{order.id.slice(0, 8)}</span>
                  <span className="order-customer" data-testid={`order-customer-${order.id}`}>{order.customer.name}</span>
                </div>
                <span className="order-status" data-testid={`order-status-${order.id}`} style={{ background: style.bg, color: style.color }}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
              <div className="order-card-bottom">
                <span className="order-items">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                <span className="order-total" data-testid={`order-total-${order.id}`}>${order.total.toFixed(2)}</span>
                <span className="order-date" data-testid={`order-date-${order.id}`}>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
