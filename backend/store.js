// In-memory data store
const { v4: uuidv4 } = require('uuid');

const store = {
  products: [
    {
      id: uuidv4(),
      name: 'Wireless Headphones',
      description: 'High-quality noise-cancelling headphones',
      price: 79.99,
      stock: 50,
      category: 'Electronics',
      image: 'https://placehold.co/300x200?text=Headphones',
    },
    {
      id: uuidv4(),
      name: 'Running Shoes',
      description: 'Lightweight and comfortable running shoes',
      price: 59.99,
      stock: 30,
      category: 'Footwear',
      image: 'https://placehold.co/300x200?text=Running+Shoes',
    },
    {
      id: uuidv4(),
      name: 'Coffee Maker',
      description: '12-cup programmable coffee maker',
      price: 39.99,
      stock: 20,
      category: 'Kitchen',
      image: 'https://placehold.co/300x200?text=Coffee+Maker',
    },
  ],
  orders: [],
};

module.exports = { store, uuidv4 };
