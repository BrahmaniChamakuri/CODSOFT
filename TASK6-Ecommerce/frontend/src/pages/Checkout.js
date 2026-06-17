import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const shipping = cartTotal > 999 ? 0 : 99;

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [payment, setPayment] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const placeOrder = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const items = cart.map(i => ({
        product:  i.product._id,
        name:     i.product.name,
        price:    i.product.price,
        quantity: i.quantity,
        emoji:    i.product.emoji
      }));
      const r = await axios.post('http://localhost:5002/api/orders', {
        items,
        shippingAddress: { name, address, city, pincode, phone },
        paymentMethod: payment
      });
      await clearCart();
      navigate('/orders', { state: { newOrder: r.data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    }
    setLoading(false);
  };

  return (
    <div className="wrap">
      <h1 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:22 }}>Checkout</h1>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:22, alignItems:'start' }}>
        <form onSubmit={placeOrder}>
          <div className="formwrap" style={{ marginBottom:18 }}>
            <h3 style={{ fontWeight:700, marginBottom:16 }}>📍 Shipping Address</h3>
            {error && <div className="errmsg">{error}</div>}
            <div className="fld"><label>Full Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required /></div>
            <div className="fld"><label>Address</label><input value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, House no." required /></div>
            <div className="fldrow">
              <div className="fld"><label>City</label><input value={city} onChange={e => setCity(e.target.value)} placeholder="City" required /></div>
              <div className="fld"><label>Pincode</label><input value={pincode} onChange={e => setPincode(e.target.value)} placeholder="Pincode" required /></div>
            </div>
            <div className="fld"><label>Phone</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" required /></div>
          </div>

          <div className="formwrap" style={{ marginBottom:18 }}>
            <h3 style={{ fontWeight:700, marginBottom:16 }}>💳 Payment Method</h3>
            {[
              { val:'cod', label:'💵 Cash on Delivery', sub:'Pay when order arrives' },
              { val:'upi', label:'📱 UPI Payment',      sub:'PhonePe, GPay, Paytm' },
              { val:'card',label:'💳 Card Payment',     sub:'Credit / Debit card' }
            ].map(p => (
              <label key={p.val} style={{ display:'flex', alignItems:'center', gap:12, padding:13, border:'2px solid ' + (payment === p.val ? 'var(--orange)' : 'var(--border)'), borderRadius:'var(--rad)', marginBottom:10, cursor:'pointer', background: payment === p.val ? 'var(--orangelight)' : '#fff' }}>
                <input type="radio" value={p.val} checked={payment === p.val} onChange={e => setPayment(e.target.value)} style={{ accentColor:'var(--orange)' }} />
                <div>
                  <div style={{ fontWeight:600, fontSize:'.9rem' }}>{p.label}</div>
                  <div style={{ fontSize:'.78rem', color:'var(--gray)' }}>{p.sub}</div>
                </div>
              </label>
            ))}
          </div>

          <button type="submit" className="btn btn-orange btn-wide" style={{ fontSize:'1rem', padding:'13px' }} disabled={loading}>
            {loading ? 'Placing Order...' : '🚀 Place Order — ₹' + (cartTotal + shipping).toLocaleString()}
          </button>
        </form>

        <div className="ordersummary">
          <h3 style={{ fontWeight:800, marginBottom:14 }}>Your Items</h3>
          {cart.map(item => (
            <div key={item.product?._id} style={{ display:'flex', gap:10, marginBottom:12, paddingBottom:12, borderBottom:'1px solid var(--border)' }}>
              <span style={{ fontSize:'1.4rem' }}>{item.product?.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'.875rem', fontWeight:600 }}>{item.product?.name}</div>
                <div style={{ fontSize:'.8rem', color:'var(--gray)' }}>Qty: {item.quantity}</div>
              </div>
              <span style={{ fontWeight:700, fontSize:'.875rem' }}>
                ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="sumrow"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
          <div className="sumrow">
            <span>Shipping</span>
            <span style={{ color: shipping === 0 ? 'var(--green)' : 'inherit' }}>
              {shipping === 0 ? 'FREE' : '₹' + shipping}
            </span>
          </div>
          <div className="sumrow" style={{ borderTop:'2px solid var(--border)' }}>
            <span>Total</span>
            <span style={{ color:'var(--orange)' }}>₹{(cartTotal + shipping).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}