const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const checkoutRouter = require('./routes/checkout');
const discountsRouter = require('./routes/discounts');
const { resetStore } = require('./store');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/discounts', discountsRouter);

app.post('/api/reset', (req, res) => {
  resetStore();
  res.json({ message: 'Store reset to seed data' });
});

// Only listen when run directly (local dev)
if (require.main === module) {
  const PORT = 3001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
