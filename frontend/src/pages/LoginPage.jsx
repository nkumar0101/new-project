import React, { useState } from 'react';
import { api } from '../api';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await api.login(form);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      onLogin(res.token, res.user);
    }
  };

  const fillDemo = (email) => setForm({ email, password: 'password123' });

  return (
    <div className="login-page" data-testid="login-page">
      <div className="login-card" data-testid="login-card">
        <div className="login-logo">ShopEasy</div>
        <h1 className="login-title">Sign in</h1>

        <form onSubmit={handleSubmit} data-testid="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              data-testid="login-email"
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              data-testid="login-password"
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="login-error" data-testid="login-error">{error}</p>}
          <button type="submit" className="btn-primary login-btn" data-testid="login-submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="demo-accounts" data-testid="demo-accounts">
          <p>Demo accounts:</p>
          <button className="demo-btn" data-testid="demo-admin-btn" onClick={() => fillDemo('admin@shopeasy.com')}>
            admin@shopeasy.com
          </button>
          <button className="demo-btn" data-testid="demo-user-btn" onClick={() => fillDemo('user@shopeasy.com')}>
            user@shopeasy.com
          </button>
          <span className="demo-hint">password: password123</span>
        </div>
      </div>
    </div>
  );
}
