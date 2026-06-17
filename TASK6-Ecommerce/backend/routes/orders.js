const router = require('express').Router();
const Order = require('../models/Order');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const subtotal     = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingCost = subtotal > 999 ? 0 : 99;
    const total         = subtotal + shippingCost;

    const order = await Order.create({
      user: req.user.id, items, shippingAddress, paymentMethod,
      subtotal, shippingCost, total
    });
    await User.findByIdAndUpdate(req.user.id, { cart: [] });
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;