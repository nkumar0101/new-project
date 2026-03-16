const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const checkoutRouter = require('./routes/checkout');
const discountsRouter = require('./routes/discounts');
const authRouter = require('./routes/auth');
const { authMiddleware } = require('./middleware/auth');
const { resetStore } = require('./store');

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/products', authMiddleware, productsRouter);
app.use('/api/orders', authMiddleware, ordersRouter);
app.use('/api/checkout', authMiddleware, checkoutRouter);
app.use('/api/discounts', authMiddleware, discountsRouter);

app.post('/api/reset', authMiddleware, (req, res) => {
  resetStore();
  res.json({ message: 'Store reset to seed data' });
});

// Only listen when run directly (local dev)
if (require.main === module) {
  const PORT = 3001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
