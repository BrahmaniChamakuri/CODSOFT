import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, updateQty, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const shipping = cartTotal > 999 ? 0 : 99;

  if (cart.length === 0) return (
    <div className="wrap">
      <div className="nodata">
        <div className="ic">🛒</div>
        <h3>Your cart is empty</h3>
        <Link to="/products" className="btn btn-orange" style={{ marginTop:14 }}>Browse Products</Link>
      </div>
    </div>
  );

  return (
    <div className="wrap">
      <h1 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:22 }}>
        Shopping Cart ({cart.length} items)
      </h1>
      <div className="cartlayout">
        <div className="cartitems">
          {cart.map(item => (
            <div className="cartitem" key={item.product?._id}>
              <div className="cartimg">{item.product?.emoji || '📦'}</div>
              <div className="cartinfo">
                <div className="cartname">{item.product?.name}</div>
                <div className="cartprice">₹{item.product?.price?.toLocaleString()}</div>
              </div>
              <div className="qtyctrl">
                <button className="qtybtn" onClick={() => updateQty(item.product?._id, item.quantity - 1)}>-</button>
                <span style={{ fontWeight:700, minWidth:28, textAlign:'center' }}>{item.quantity}</span>
                <button className="qtybtn" onClick={() => updateQty(item.product?._id, item.quantity + 1)}>+</button>
              </div>
              <div style={{ fontWeight:800, minWidth:80, textAlign:'right' }}>
                ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
              </div>
              <button onClick={() => updateQty(item.product?._id, 0)}
                style={{ background:'none', border:'none', cursor:'pointer', color:'var(--gray)', fontSize:'1.2rem' }}>
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="ordersummary">
          <h3 style={{ fontWeight:800, marginBottom:16 }}>Order Summary</h3>
          <div className="sumrow"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
          <div className="sumrow">
            <span>Shipping</span>
            <span style={{ color: shipping === 0 ? 'var(--green)' : 'inherit' }}>
              {shipping === 0 ? 'FREE' : '₹' + shipping}
            </span>
          </div>
          {shipping > 0 && <p style={{ fontSize:'.75rem', color:'var(--gray)', marginTop:4, marginBottom:4 }}>Free shipping above ₹999</p>}
          <div className="sumrow" style={{ borderTop:'2px solid var(--border)' }}>
            <span>Total</span>
            <span style={{ color:'var(--orange)' }}>₹{(cartTotal + shipping).toLocaleString()}</span>
          </div>
          <button className="btn btn-orange btn-wide" style={{ marginTop:16 }}
            onClick={() => user ? navigate('/checkout') : navigate('/login')}>
            {user ? 'Proceed to Checkout →' : 'Login to Checkout'}
          </button>
          <Link to="/products" className="btn btn-border btn-wide" style={{ marginTop:10 }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}