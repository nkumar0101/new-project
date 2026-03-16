const BASE = `${window.location.origin}/api`;

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token
    ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
};

export const api = {
  // Auth
  login: (data) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  logout: () =>
    fetch(`${BASE}/auth/logout`, { method: 'POST', headers: authHeaders() }).then(r => r.json()),

  // Products
  getProducts: () => fetch(`${BASE}/products`, { headers: authHeaders() }).then(r => r.json()),
  getProduct: (id) => fetch(`${BASE}/products/${id}`, { headers: authHeaders() }).then(r => r.json()),
  createProduct: (data) =>
    fetch(`${BASE}/products`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(r => r.json()),
  updateProduct: (id, data) =>
    fetch(`${BASE}/products/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(r => r.json()),
  deleteProduct: (id) =>
    fetch(`${BASE}/products/${id}`, { method: 'DELETE', headers: authHeaders() }).then(r => r.json()),

  // Reset
  reset: () => fetch(`${BASE}/reset`, { method: 'POST', headers: authHeaders() }).then(r => r.json()),

  // Reviews
  getAllReviews: () => fetch(`${BASE}/products/reviews/all`, { headers: authHeaders() }).then(r => r.json()),
  getReviews: (productId) => fetch(`${BASE}/products/${productId}/reviews`, { headers: authHeaders() }).then(r => r.json()),
  createReview: (productId, data) =>
    fetch(`${BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(r => r.json()),

  // Orders
  getOrders: () => fetch(`${BASE}/orders`, { headers: authHeaders() }).then(r => r.json()),
  getOrder: (id) => fetch(`${BASE}/orders/${id}`, { headers: authHeaders() }).then(r => r.json()),

  // Discounts
  validateDiscount: (code) => fetch(`${BASE}/discounts/validate/${encodeURIComponent(code)}`, { headers: authHeaders() }).then(r => r.json()),

  // Checkout
  checkout: (data) =>
    fetch(`${BASE}/checkout`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(r => r.json()),
};
