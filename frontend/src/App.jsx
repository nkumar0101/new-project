import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setCart([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity }];
    });
  };

  const updateCartItem = (productId, quantity) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(i => i.productId !== productId));
    } else {
      setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
    }
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
      </Routes>
    );
  }

  return (
    <div className="app" data-testid="app">
      <header className="header" data-testid="header">
        <div className="header-inner">
          <NavLink to="/" className="logo" data-testid="nav-logo">ShopEasy</NavLink>
          <nav className="nav" data-testid="nav">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end data-testid="nav-products">
              Products
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} data-testid="nav-orders">
              Orders
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-link cart-link active' : 'nav-link cart-link'} data-testid="nav-cart">
              Cart {cartCount > 0 && <span className="cart-badge" data-testid="cart-badge">{cartCount}</span>}
            </NavLink>
            <span className="nav-user" data-testid="nav-user">{user.name}</span>
            <button className="logout-btn" data-testid="logout-btn" onClick={handleLogout}>Sign out</button>
          </nav>
        </div>
      </header>

      <main className="main" data-testid="main">
        <Routes>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/" element={<ProtectedRoute><ProductsPage addToCart={addToCart} clearCart={clearCart} /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartPage cart={cart} updateCartItem={updateCartItem} /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage cart={cart} clearCart={clearCart} /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}
