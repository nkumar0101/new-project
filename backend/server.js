const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const checkoutRouter = require('./routes/checkout');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/checkout', checkoutRouter);

// Only listen when run directly (local dev)
if (require.main === module) {
  const PORT = 3001;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
