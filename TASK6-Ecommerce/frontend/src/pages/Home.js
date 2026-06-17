import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [added, setAdded] = useState({});
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5002/api/products/featured')
      .then(r => setProducts(r.data)).catch(() => {});
  }, []);

  const seedProducts = async () => {
    await axios.post('http://localhost:5002/api/products/seed');
    const r = await axios.get('http://localhost:5002/api/products/featured');
    setProducts(r.data);
  };

  const handleAdd = async (e, id) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    const ok = await addToCart(id);
    if (ok) {
      setAdded(a => ({ ...a, [id]: true }));
      setTimeout(() => setAdded(a => ({ ...a, [id]: false })), 1500);
    }
  };

  return (
    <div>
      <div className="shophero">
        <h1>Welcome to ShopSphere 🛍️</h1>
        <p>Discover amazing products at unbeatable prices</p>
        <div className="herosearch">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            onKeyDown={e => e.key === 'Enter' && navigate('/products?search=' + search)} />
          <button className="btn btn-orange" onClick={() => navigate('/products?search=' + search)}>
            Search
          </button>
        </div>
        <div style={{ marginTop:20, display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/products" style={{ background:'rgba(255,255,255,.2)', color:'#fff', padding:'8px 20px', borderRadius:8, fontWeight:600 }}>
            Browse All
          </Link>
          <button onClick={seedProducts} style={{ background:'rgba(255,255,255,.15)', color:'#fff', border:'1.5px solid rgba(255,255,255,.4)', padding:'8px 20px', borderRadius:8, fontWeight:600, cursor:'pointer' }}>
            🌱 Load Demo Products
          </button>
        </div>
      </div>

      <div className="wrap">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
          <h2 style={{ fontSize:'1.3rem', fontWeight:800 }}>Featured Products</h2>
          <Link to="/products" className="btn btn-border btn-small">View All →</Link>
        </div>

        <div className="prodgrid">
          {products.map(p => {
            const disc = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
            return (
              <Link to={'/products/' + p._id} key={p._id} style={{ textDecoration:'none' }}>
                <div className="prodcard">
                  <div className="prodimg">{p.emoji}</div>
                  <div className="prodbody">
                    <div className="prodcat">{p.category}</div>
                    <div className="prodname">{p.name}</div>
                    <div className="prodstars">{'★'.repeat(Math.round(p.rating))} ({p.numReviews})</div>
                    <div className="pricerow">
                      <span className="price">₹{p.price.toLocaleString()}</span>
                      {p.originalPrice && <span className="origprice">₹{p.originalPrice.toLocaleString()}</span>}
                      {disc > 0 && <span className="discbadge">{disc}% OFF</span>}
                    </div>
                    <button className="btn btn-orange btn-wide" style={{ fontSize:'.82rem' }}
                      onClick={e => handleAdd(e, p._id)}>
                      {added[p._id] ? '✅ Added!' : '🛒 Add to Cart'}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="nodata">
            <div className="ic">🏪</div>
            <h3>No products yet</h3>
            <p>Click "Load Demo Products" above to add sample items</p>
          </div>
        )}
      </div>
    </div>
  );
}