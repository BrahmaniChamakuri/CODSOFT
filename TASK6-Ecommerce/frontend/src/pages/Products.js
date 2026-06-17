import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [added, setAdded] = useState({});
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const load = async (s, c, so) => {
    try {
      const r = await axios.get('http://localhost:5002/api/products', { params: { search:s, category:c, sort:so } });
      setProducts(r.data.products);
      setCategories(r.data.categories || []);
    } catch {}
  };

  useEffect(() => {
    const q = params.get('search') || '';
    setSearch(q);
    load(q, '', '');
  }, []);

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
    <div className="wrap">
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load(search, category, sort)}
          placeholder="🔍 Search products..."
          style={{ flex:1, minWidth:180, border:'1.5px solid var(--border)', borderRadius:8, padding:'9px 13px', fontSize:'.875rem', outline:'none' }} />
        <select value={sort} onChange={e => { setSort(e.target.value); load(search, category, e.target.value); }}
          style={{ border:'1.5px solid var(--border)', borderRadius:8, padding:'9px 13px', fontSize:'.875rem', background:'#fff', cursor:'pointer' }}>
          <option value="">Sort: Latest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Best Rated</option>
        </select>
        <button className="btn btn-orange" onClick={() => load(search, category, sort)}>Search</button>
      </div>

      <div className="shoplayout">
        <div className="sidebar">
          <h3>Category</h3>
          {['All', ...categories].map(cat => (
            <div key={cat} className="sideopt"
              onClick={() => { const val = cat === 'All' ? '' : cat; setCategory(val); load(search, val, sort); }}>
              <input type="radio" readOnly checked={category === (cat === 'All' ? '' : cat)} />
              {cat}
            </div>
          ))}
        </div>

        <div>
          <p style={{ color:'var(--gray)', fontSize:'.875rem', marginBottom:14 }}>
            {products.length} products found
          </p>
          {products.length === 0 ? (
            <div className="nodata"><div className="ic">🔍</div><h3>No products found</h3></div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}