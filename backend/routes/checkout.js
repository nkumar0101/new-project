const express = require('express');
const router = express.Router();
const { store, uuidv4 } = require('../store');

// POST fake checkout
router.post('/', (req, res) => {
  const { items, customer, paymentMethod, discountCode } = req.body;

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

  // Validate discount code if provided
  let discount = null;
  if (discountCode) {
    discount = store.discounts.find(d => d.code === discountCode.toUpperCase());
    if (!discount) {
      return res.status(400).json({ error: 'Invalid discount code' });
    }
  }

  // Validate items and calculate total
  const orderItems = [];
  let subtotal = 0;

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
    subtotal += product.price * item.quantity;
  }

  // Apply discount
  let discountAmount = 0;
  if (discount) {
    if (discount.type === 'percent') {
      discountAmount = subtotal * (discount.value / 100);
    } else {
      discountAmount = Math.min(discount.value, subtotal);
    }
  }
  const total = Math.max(0, subtotal - discountAmount);

  // Deduct stock
  for (const item of items) {
    const product = store.products.find(p => p.id === item.productId);
    product.stock -= item.quantity;
  }

  const order = {
    id: uuidv4(),
    customer,
    items: orderItems,
    subtotal: parseFloat(subtotal.toFixed(2)),
    discountCode: discount ? discount.code : null,
    discountAmount: parseFloat(discountAmount.toFixed(2)),
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
