import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5002/api/products/' + id)
      .then(r => setProduct(r.data)).catch(() => navigate('/products'));
  }, [id]);

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return; }
    for (let i = 0; i < qty; i++) await addToCart(id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) return <div className="wrap"><p>Loading...</p></div>;

  const disc = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="wrap">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'start' }}>
        <div style={{ background:'#f3f4f6', borderRadius:'var(--rad)', height:320, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'8rem', border:'1px solid var(--border)' }}>
          {product.emoji}
        </div>
        <div>
          <div style={{ fontSize:'.78rem', fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'var(--orange)', marginBottom:8 }}>
            {product.category}
          </div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:10 }}>{product.name}</h1>
          <div style={{ fontSize:'.9rem', color:'#f59e0b', marginBottom:14 }}>
            {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            <span style={{ color:'var(--gray)', marginLeft:6 }}>({product.numReviews} reviews)</span>
          </div>
          <div className="pricerow" style={{ marginBottom:16 }}>
            <span style={{ fontSize:'1.6rem', fontWeight:800 }}>₹{product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="origprice" style={{ fontSize:'1rem' }}>₹{product.originalPrice.toLocaleString()}</span>}
            {disc > 0 && <span className="discbadge" style={{ fontSize:'.8rem', padding:'4px 10px' }}>{disc}% OFF</span>}
          </div>
          <p style={{ color:'var(--gray)', marginBottom:22, lineHeight:1.7 }}>{product.description}</p>

          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
            <span style={{ fontWeight:600, fontSize:'.875rem' }}>Qty:</span>
            <div className="qtyctrl">
              <button className="qtybtn" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
              <span style={{ fontWeight:700, minWidth:28, textAlign:'center' }}>{qty}</span>
              <button className="qtybtn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          <button className="btn btn-orange" style={{ padding:'13px 32px', fontSize:'1rem', width:'100%', justifyContent:'center' }}
            onClick={handleAdd}>
            {added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
          </button>

          <div style={{ marginTop:18, padding:14, background:'#f3f4f6', borderRadius:'var(--rad)', fontSize:'.875rem' }}>
            <p>✅ In Stock ({product.stock} available)</p>
            <p style={{ marginTop:6 }}>🚚 Free delivery on orders above ₹999</p>
          </div>
        </div>
      </div>
    </div>
  );
}