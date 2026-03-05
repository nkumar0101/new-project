const express = require('express');
const router = express.Router();
const { store } = require('../store');

// GET all orders
router.get('/', (req, res) => {
  res.json(store.orders);
});

// GET single order
router.get('/:id', (req, res) => {
  const order = store.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

module.exports = router;
