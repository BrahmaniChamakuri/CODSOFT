const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:     String,
    price:    Number,
    quantity: Number,
    emoji:    String
  }],
  shippingAddress: {
    name:    String,
    address: String,
    city:    String,
    pincode: String,
    phone:   String
  },
  paymentMethod: { type: String, default: 'cod' },
  subtotal:      Number,
  shippingCost:  Number,
  total:         Number,
  status:        { type: String, default: 'processing' },
  createdAt:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);