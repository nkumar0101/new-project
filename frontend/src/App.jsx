import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import './App.css';

export default function App() {
  const [cart, setCart] = useState([]);

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

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <NavLink to="/" className="logo">ShopEasy</NavLink>
          <nav className="nav">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
              Products
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Orders
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-link cart-link active' : 'nav-link cart-link'}>
              Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<ProductsPage addToCart={addToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} updateCartItem={updateCartItem} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} clearCart={clearCart} />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}
