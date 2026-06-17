const router = require('express').Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    const query = {};
    if (search) query.$or = [
      { name:        { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
    if (category && category !== 'All') query.category = category;

    let sortObj = { createdAt: -1 };
    if (sort === 'price-low')  sortObj = { price:  1 };
    if (sort === 'price-high') sortObj = { price: -1 };
    if (sort === 'rating')     sortObj = { rating: -1 };

    const products   = await Product.find(query).sort(sortObj);
    const categories = await Product.distinct('category');
    res.json({ products, categories });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const items = [
      { name:'Wireless Earbuds',    description:'Premium sound with 30hr battery',          price:1999, originalPrice:3999,  category:'Electronics', emoji:'🎧', stock:50, rating:4.5, numReviews:128, featured:true },
      { name:'Running Shoes',       description:'Ultra-light foam for long runs',           price:2499, originalPrice:4999,  category:'Footwear',    emoji:'👟', stock:30, rating:4.3, numReviews:89,  featured:true },
      { name:'Smart Watch',         description:'Health tracking, GPS, AMOLED display',     price:8999, originalPrice:14999, category:'Electronics', emoji:'⌚', stock:20, rating:4.7, numReviews:210, featured:true },
      { name:'Leather Backpack',    description:'Genuine leather, 30L, laptop sleeve',      price:3499, originalPrice:5999,  category:'Bags',        emoji:'🎒', stock:25, rating:4.2, numReviews:56,  featured:false },
      { name:'Mechanical Keyboard', description:'RGB backlit, tactile switches',            price:4299, originalPrice:6999,  category:'Electronics', emoji:'⌨️', stock:15, rating:4.6, numReviews:174, featured:true },
      { name:'Yoga Mat',            description:'Anti-slip, 6mm thick, eco-friendly',       price:899,  originalPrice:1499,  category:'Sports',      emoji:'🧘', stock:60, rating:4.4, numReviews:43,  featured:false },
      { name:'Coffee Maker',        description:'Brew perfect coffee every morning',        price:5999, originalPrice:9999,  category:'Kitchen',     emoji:'☕', stock:12, rating:4.8, numReviews:95,  featured:true },
      { name:'Sunglasses',          description:'Polarized UV400, titanium frame',          price:1299, originalPrice:2999,  category:'Accessories', emoji:'🕶️', stock:40, rating:4.1, numReviews:31,  featured:false },
    ];
    await Product.insertMany(items);
    res.json({ message: '8 products added!' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;