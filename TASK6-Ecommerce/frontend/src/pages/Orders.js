import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { state } = useLocation();

  useEffect(() => {
    axios.get('http://localhost:5002/api/orders/my')
      .then(r => setOrders(r.data)).catch(() => {});
  }, []);

  return (
    <div className="wrap">
      <h1 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:22 }}>My Orders</h1>

      {state?.newOrder && (
        <div style={{ background:'#dcfce7', border:'1px solid #bbf7d0', borderRadius:'var(--rad)', padding:'16px 20px', marginBottom:20, display:'flex', gap:12 }}>
          <span style={{ fontSize:'1.5rem' }}>🎉</span>
          <div>
            <strong>Order Placed Successfully!</strong>
            <p style={{ fontSize:'.875rem', color:'var(--gray)' }}>
              Order ID: #{state.newOrder._id?.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="nodata">
          <div className="ic">📦</div>
          <h3>No orders yet</h3>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {orders.map(order => (
            <div key={order._id} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--rad)', padding:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, flexWrap:'wrap', gap:8 }}>
                <div>
                  <span style={{ fontWeight:700 }}>Order #{order._id?.slice(-8).toUpperCase()}</span>
                  <p style={{ color:'var(--gray)', fontSize:'.8rem', marginTop:2 }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                  </p>
                </div>
                <span className="pillproc">{order.status}</span>
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:14 }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ background:'#f3f4f6', padding:'7px 12px', borderRadius:8, fontSize:'.82rem', display:'flex', gap:5, alignItems:'center' }}>
                    <span>{item.emoji}</span>
                    <span>{item.name}</span>
                    <span style={{ color:'var(--gray)' }}>× {item.quantity}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid var(--border)' }}>
                <span style={{ fontSize:'.875rem', color:'var(--gray)' }}>📍 {order.shippingAddress?.city}</span>
                <span style={{ fontWeight:800, color:'var(--orange)' }}>₹{order.total?.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}