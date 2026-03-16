const express = require('express');
const router = express.Router();
const { store } = require('../store');

// GET orders for the logged-in user (paginated)
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const userOrders = store.orders.filter(o => o.userId === req.user.id);
  const start = (page - 1) * limit;
  res.json({
    orders: userOrders.slice(start, start + limit),
    total: userOrders.length,
    page,
    limit,
  });
});

// GET single order
router.get('/:id', (req, res) => {
  const order = store.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

module.exports = router;
