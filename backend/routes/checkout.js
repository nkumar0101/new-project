const express = require('express');
const router = express.Router();
const { store, uuidv4 } = require('../store');

// POST fake checkout
router.post('/', (req, res) => {
  const { items, customer, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  if (!customer || !customer.name || !customer.email) {
    return res.status(400).json({ error: 'Customer name and email are required' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customer.email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Validate items and calculate total
  const orderItems = [];
  let total = 0;

  for (const item of items) {
    const product = store.products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ error: `Product ${item.productId} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
    }
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      subtotal: product.price * item.quantity,
    });
    total += product.price * item.quantity;
  }

  // Deduct stock
  for (const item of items) {
    const product = store.products.find(p => p.id === item.productId);
    product.stock -= item.quantity;
  }

  const order = {
    id: uuidv4(),
    customer,
    items: orderItems,
    total: parseFloat(total.toFixed(2)),
    paymentMethod: paymentMethod || 'credit_card',
    paymentStatus: 'success',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  store.orders.push(order);
  res.status(201).json(order);
});


module.exports = router;
