const express = require('express');
const router = express.Router();
const { store, uuidv4 } = require('../store');

// GET all products
router.get('/', (req, res) => {
  res.json(store.products);
});

// GET single product
router.get('/:id', (req, res) => {
  const product = store.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST create product
router.post('/', (req, res) => {
  const { name, description, price, stock, category, image } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  const product = {
    id: uuidv4(),
    name,
    description: description || '',
    price: parseFloat(price),
    stock: parseInt(stock) || 0,
    category: category || 'General',
    image: image || `https://placehold.co/300x200?text=${encodeURIComponent(name)}`,
  };
  store.products.unshift(product);
  res.status(201).json(product);
});

// PUT update product
router.put('/:id', (req, res) => {
  const idx = store.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  store.products[idx] = { ...store.products[idx], ...req.body, id: req.params.id };
  res.json(store.products[idx]);
});

// DELETE product
router.delete('/:id', (req, res) => {
  const idx = store.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  store.products.splice(idx, 1);
  res.json({ message: 'Product deleted' });
});

// GET all reviews (across all products)
router.get('/reviews/all', (req, res) => {
  res.json(store.reviews);
});

// GET reviews for a product
router.get('/:id/reviews', (req, res) => {
  const product = store.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const reviews = store.reviews.filter(r => r.productId === req.params.id);
  res.json(reviews);
});

// POST a review for a product
router.post('/:id/reviews', (req, res) => {
  const product = store.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const { author, rating, comment } = req.body;
  if (!author || !rating) return res.status(400).json({ error: 'Author and rating are required' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  const review = {
    id: uuidv4(),
    productId: req.params.id,
    author,
    rating: parseInt(rating),
    comment: comment || '',
    createdAt: new Date().toISOString(),
  };
  store.reviews.push(review);
  res.status(201).json(review);
});

module.exports = router;
