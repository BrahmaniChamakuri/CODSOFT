const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    if (await User.findOne({ email: req.body.email }))
      return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.matchPassword(req.body.password)))
      return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/cart', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    res.json(user.cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/cart/add', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const existing = user.cart.find(i => String(i.product) === req.body.productId);
    if (existing) existing.quantity += 1;
    else user.cart.push({ product: req.body.productId, quantity: 1 });
    await user.save();
    const updated = await User.findById(req.user.id).populate('cart.product');
    res.json(updated.cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/cart/update', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { productId, quantity } = req.body;
    if (quantity <= 0) {
      user.cart = user.cart.filter(i => String(i.product) !== productId);
    } else {
      const item = user.cart.find(i => String(i.product) === productId);
      if (item) item.quantity = quantity;
    }
    await user.save();
    const updated = await User.findById(req.user.id).populate('cart.product');
    res.json(updated.cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/cart/clear', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { cart: [] });
    res.json([]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;