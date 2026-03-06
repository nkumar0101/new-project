// In-memory data store
const { v4: uuidv4 } = require('uuid');

function createSeedData() {
  const p = Array.from({ length: 15 }, () => uuidv4());

  const products = [
    { id: p[0],  name: 'Wireless Headphones',         description: 'High-quality noise-cancelling headphones',                       price: 79.99,  stock: 50,  category: 'Electronics', image: 'https://placehold.co/300x200?text=Headphones' },
    { id: p[1],  name: 'Running Shoes',                description: 'Lightweight and comfortable running shoes',                       price: 59.99,  stock: 30,  category: 'Footwear',    image: 'https://placehold.co/300x200?text=Running+Shoes' },
    { id: p[2],  name: 'Coffee Maker',                 description: '12-cup programmable coffee maker',                                price: 39.99,  stock: 20,  category: 'Kitchen',     image: 'https://placehold.co/300x200?text=Coffee+Maker' },
    { id: p[3],  name: 'Mechanical Keyboard',          description: 'Compact TKL mechanical keyboard with RGB backlight',              price: 89.99,  stock: 35,  category: 'Electronics', image: 'https://placehold.co/300x200?text=Keyboard' },
    { id: p[4],  name: 'Yoga Mat',                     description: 'Non-slip eco-friendly yoga mat, 6mm thick',                      price: 29.99,  stock: 60,  category: 'Sports',      image: 'https://placehold.co/300x200?text=Yoga+Mat' },
    { id: p[5],  name: 'Leather Wallet',               description: 'Slim genuine leather bifold wallet with RFID blocking',          price: 24.99,  stock: 80,  category: 'Clothing',    image: 'https://placehold.co/300x200?text=Wallet' },
    { id: p[6],  name: 'Stainless Steel Water Bottle', description: 'Insulated 32oz bottle keeps drinks cold for 24 hours',          price: 19.99,  stock: 100, category: 'Sports',      image: 'https://placehold.co/300x200?text=Water+Bottle' },
    { id: p[7],  name: 'Desk Lamp',                    description: 'LED desk lamp with adjustable brightness and USB charging port', price: 34.99,  stock: 45,  category: 'Electronics', image: 'https://placehold.co/300x200?text=Desk+Lamp' },
    { id: p[8],  name: 'Hiking Boots',                 description: 'Waterproof mid-cut hiking boots with ankle support',             price: 109.99, stock: 25,  category: 'Footwear',    image: 'https://placehold.co/300x200?text=Hiking+Boots' },
    { id: p[9],  name: 'Blender',                      description: 'High-speed personal blender for smoothies and shakes',           price: 49.99,  stock: 30,  category: 'Kitchen',     image: 'https://placehold.co/300x200?text=Blender' },
    { id: p[10], name: 'Sunglasses',                   description: 'Polarized UV400 sunglasses with lightweight frame',              price: 44.99,  stock: 55,  category: 'Clothing',    image: 'https://placehold.co/300x200?text=Sunglasses' },
    { id: p[11], name: 'Resistance Bands Set',         description: 'Set of 5 resistance bands for home workouts',                    price: 17.99,  stock: 90,  category: 'Sports',      image: 'https://placehold.co/300x200?text=Resistance+Bands' },
    { id: p[12], name: 'Graphic Novel Collection',     description: 'Award-winning 3-volume graphic novel series',                    price: 54.99,  stock: 20,  category: 'Books',       image: 'https://placehold.co/300x200?text=Graphic+Novels' },
    { id: p[13], name: 'Wireless Mouse',               description: 'Ergonomic wireless mouse with silent click and long battery life', price: 32.99, stock: 70,  category: 'Electronics', image: 'https://placehold.co/300x200?text=Wireless+Mouse' },
    { id: p[14], name: 'Cast Iron Skillet',            description: 'Pre-seasoned 10-inch cast iron skillet, oven safe',              price: 27.99,  stock: 40,  category: 'Kitchen',     image: 'https://placehold.co/300x200?text=Cast+Iron+Skillet' },
  ];

  const reviews = [
    { id: uuidv4(), productId: p[0],  author: 'Alex M.',    rating: 5, comment: 'Incredible sound quality and the noise cancellation is top notch. Best headphones I have owned.', createdAt: '2026-01-10T09:00:00.000Z' },
    { id: uuidv4(), productId: p[0],  author: 'Jamie L.',   rating: 4, comment: 'Great headphones, very comfortable for long sessions. Battery life is excellent.', createdAt: '2026-01-18T14:30:00.000Z' },
    { id: uuidv4(), productId: p[0],  author: 'Chris R.',   rating: 5, comment: 'Perfect for working from home. The noise cancellation blocks everything out.', createdAt: '2026-02-02T11:15:00.000Z' },
    { id: uuidv4(), productId: p[1],  author: 'Sam T.',     rating: 4, comment: 'Really lightweight and great for long runs. Sizing runs slightly small so order up.', createdAt: '2026-01-05T08:00:00.000Z' },
    { id: uuidv4(), productId: p[1],  author: 'Dana W.',    rating: 5, comment: 'Super comfortable right out of the box. No break-in period needed at all.', createdAt: '2026-01-22T16:45:00.000Z' },
    { id: uuidv4(), productId: p[2],  author: 'Morgan K.',  rating: 3, comment: 'Makes decent coffee but the carafe drips a little. Gets the job done for the price.', createdAt: '2026-01-12T07:30:00.000Z' },
    { id: uuidv4(), productId: p[2],  author: 'Riley B.',   rating: 4, comment: 'Easy to use and the programmable timer is really convenient for mornings.', createdAt: '2026-02-01T09:00:00.000Z' },
    { id: uuidv4(), productId: p[3],  author: 'Jordan P.',  rating: 5, comment: 'The tactile feedback is amazing. My typing speed has noticeably improved since switching.', createdAt: '2026-01-08T13:00:00.000Z' },
    { id: uuidv4(), productId: p[3],  author: 'Casey F.',   rating: 4, comment: 'Great keyboard, the RGB is vibrant. A bit loud for office use but perfect at home.', createdAt: '2026-01-30T10:20:00.000Z' },
    { id: uuidv4(), productId: p[4],  author: 'Taylor N.',  rating: 5, comment: 'Excellent grip and the thickness is perfect. Does not slip at all even during hot yoga.', createdAt: '2026-01-15T17:00:00.000Z' },
    { id: uuidv4(), productId: p[6],  author: 'Quinn H.',   rating: 5, comment: 'Keeps my water cold all day even in hot weather. The build quality feels very premium.', createdAt: '2026-01-20T12:00:00.000Z' },
    { id: uuidv4(), productId: p[6],  author: 'Avery S.',   rating: 4, comment: 'Great bottle, does exactly what it promises. The lid could seal a bit more securely though.', createdAt: '2026-02-05T08:45:00.000Z' },
    { id: uuidv4(), productId: p[8],  author: 'Blake O.',   rating: 5, comment: 'Tackled a muddy trail in these and my feet stayed completely dry. Very impressed.', createdAt: '2026-01-25T14:00:00.000Z' },
    { id: uuidv4(), productId: p[9],  author: 'Peyton C.',  rating: 4, comment: 'Blends everything smoothly and is super easy to clean. Motor sounds powerful and reliable.', createdAt: '2026-02-08T11:30:00.000Z' },
    { id: uuidv4(), productId: p[13], author: 'Reese V.',   rating: 5, comment: 'Smooth tracking on any surface and the battery lasts weeks. Completely silent clicks.', createdAt: '2026-01-28T15:00:00.000Z' },
  ];

  return { products, reviews, orders: [] };
}

const store = createSeedData();

const resetStore = () => {
  const seed = createSeedData();
  store.products = seed.products;
  store.reviews = seed.reviews;
  store.orders = seed.orders;
};

module.exports = { store, uuidv4, resetStore };
