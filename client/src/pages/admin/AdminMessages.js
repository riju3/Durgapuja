import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchMessages = () => {
    setLoading(true);
    api.get('/contact').then(r => { setMessages(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/contact/${id}/read`);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try { await api.delete(`/contact/${id}`); toast.success('Deleted'); setMessages(prev => prev.filter(m => m._id !== id)); }
    catch { toast.error('Failed'); }
  };

  const filtered = filter === 'unread' ? messages.filter(m => !m.read) : filter === 'read' ? messages.filter(m => m.read) : messages;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#1a0a00', fontSize: '1.8rem', margin: 0 }}>
          Messages <span style={{ background: '#C0392B', color: '#fff', borderRadius: '20px', padding: '2px 12px', fontSize: '1rem' }}>{messages.filter(m => !m.read).length}</span>
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'unread', 'read'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '7px 18px', border: '2px solid #C0392B', borderRadius: '20px', cursor: 'pointer', background: filter === f ? '#C0392B' : '#fff', color: filter === f ? '#fff' : '#C0392B', fontWeight: '600', fontSize: '0.85rem', textTransform: 'capitalize' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? <p style={{ textAlign: 'center', color: '#C0392B', padding: '40px' }}>Loading...</p>
        : filtered.length === 0 ? <p style={{ textAlign: 'center', color: '#7a5c4f', padding: '40px' }}>No messages found.</p>
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filtered.map(m => (
              <div key={m._id} style={{
                background: '#fff', borderRadius: '12px', padding: '20px 24px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.07)',
                borderLeft: `5px solid ${m.read ? '#e8d5c4' : '#C0392B'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ color: '#1a0a00', fontWeight: '700', marginBottom: '2px' }}>{m.name}
                      {!m.read && <span style={{ marginLeft: '8px', background: '#C0392B', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>NEW</span>}
                    </h4>
                    <a href={`mailto:${m.email}`} style={{ color: '#C0392B', fontSize: '0.85rem' }}>{m.email}</a>
                  </div>
                  <span style={{ color: '#7a5c4f', fontSize: '0.8rem' }}>{new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p style={{ color: '#3d2b1f', lineHeight: 1.7, fontSize: '0.9rem', background: '#fef9f5', padding: '12px 14px', borderRadius: '8px', marginBottom: '12px' }}>{m.message}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {!m.read && (
                    <button onClick={() => markRead(m._id)} style={{ padding: '7px 16px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem' }}>✅ Mark Read</button>
                  )}
                  <a href={`mailto:${m.email}?subject=Re: Your message to Chowdhurybati Durga Puja`}
                    style={{ padding: '7px 16px', background: '#2980b9', color: '#fff', borderRadius: '6px', fontWeight: '600', fontSize: '0.82rem', textDecoration: 'none' }}>✉️ Reply</a>
                  <button onClick={() => handleDelete(m._id)} style={{ padding: '7px 16px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem' }}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
