const express = require('express');
const router = express.Router();
const { store } = require('../store');

// GET /api/discounts/validate/:code
router.get('/validate/:code', (req, res) => {
  const discount = store.discounts.find(
    d => d.code === req.params.code.toUpperCase()
  );
  if (!discount) {
    return res.status(404).json({ error: 'Invalid discount code' });
  }
  res.json(discount);
});

module.exports = router;
