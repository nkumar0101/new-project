const BASE = 'https://new-project-nkumar0101s-projects.vercel.app/api';

export const api = {
  // Products
  getProducts: () => fetch(`${BASE}/products`).then(r => r.json()),
  getProduct: (id) => fetch(`${BASE}/products/${id}`).then(r => r.json()),
  createProduct: (data) =>
    fetch(`${BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  updateProduct: (id, data) =>
    fetch(`${BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  deleteProduct: (id) =>
    fetch(`${BASE}/products/${id}`, { method: 'DELETE' }).then(r => r.json()),

  // Reviews
  getAllReviews: () => fetch(`${BASE}/products/reviews/all`).then(r => r.json()),
  getReviews: (productId) => fetch(`${BASE}/products/${productId}/reviews`).then(r => r.json()),
  createReview: (productId, data) =>
    fetch(`${BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  // Orders
  getOrders: () => fetch(`${BASE}/orders`).then(r => r.json()),
  getOrder: (id) => fetch(`${BASE}/orders/${id}`).then(r => r.json()),

  // Checkout
  checkout: (data) =>
    fetch(`${BASE}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
};
