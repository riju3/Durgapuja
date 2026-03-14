import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ gallery: 0, events: 0, team: 0, messages: 0, unread: 0 });
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    Promise.all([
      api.get('/gallery'),
      api.get('/events'),
      api.get('/team'),
      api.get('/contact'),
      api.get('/settings'),
    ]).then(([g, e, t, c, s]) => {
      setStats({
        gallery: g.data.length,
        events: e.data.length,
        team: t.data.length,
        messages: c.data.length,
        unread: c.data.filter(m => !m.read).length,
      });
      setMessages(c.data.slice(0, 5));
      setSettings(s.data);
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Gallery Photos', value: stats.gallery, icon: '🖼️', to: '/admin/gallery', color: '#C0392B' },
    { label: 'Puja Events', value: stats.events, icon: '📅', to: '/admin/events', color: '#D4AF37' },
    { label: 'Team Members', value: stats.team, icon: '👥', to: '/admin/team', color: '#2980b9' },
    { label: 'Messages', value: stats.messages, icon: '✉️', to: '/admin/messages', color: '#27ae60', badge: stats.unread },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#1a0a00', fontSize: '1.8rem', marginBottom: '8px' }}>Dashboard</h2>
      <p style={{ color: '#7a5c4f', marginBottom: '30px', fontFamily: 'Hind Siliguri, sans-serif' }}>
        পূজা বর্ষ: <strong style={{ color: '#C0392B' }}>{settings.pujaYear || 2025}</strong>
      </p>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        {cards.map(c => (
          <Link to={c.to} key={c.label} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', borderRadius: '12px', padding: '24px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.07)',
              borderLeft: `5px solid ${c.color}`,
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer', position: 'relative',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.07)'; }}>
              {c.badge > 0 && (
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#C0392B', color: '#fff', borderRadius: '20px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: '700' }}>
                  {c.badge} new
                </span>
              )}
              <div style={{ fontSize: '2.2rem', marginBottom: '10px' }}>{c.icon}</div>
              <h3 style={{ fontSize: '2rem', fontWeight: '800', color: c.color, lineHeight: 1 }}>{c.value}</h3>
              <p style={{ color: '#7a5c4f', fontSize: '0.9rem', marginTop: '4px' }}>{c.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="dash-grid">
        {/* Recent Messages */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#1a0a00', fontSize: '1.1rem' }}>Recent Messages</h3>
            <Link to="/admin/messages" style={{ color: '#C0392B', fontSize: '0.85rem', fontWeight: '600' }}>View All →</Link>
          </div>
          {messages.length === 0
            ? <p style={{ color: '#7a5c4f', textAlign: 'center', padding: '20px' }}>No messages yet</p>
            : messages.map(m => (
              <div key={m._id} style={{ padding: '12px 0', borderBottom: '1px solid #f0e0d0', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.read ? '#ccc' : '#C0392B', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: '600', color: '#1a0a00', fontSize: '0.9rem' }}>{m.name}</p>
                  <p style={{ color: '#7a5c4f', fontSize: '0.82rem', marginTop: '2px' }}>{m.message.slice(0, 60)}...</p>
                </div>
              </div>
            ))
          }
        </div>

        {/* Quick Links */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#1a0a00', fontSize: '1.1rem', marginBottom: '18px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { to: '/admin/gallery', label: '📸 Upload Gallery Photo', bg: '#fef3f2' },
              { to: '/admin/events', label: '📅 Add Puja Day', bg: '#fefce8' },
              { to: '/admin/team', label: '👤 Add Team Member', bg: '#f0f9ff' },
              { to: '/admin/settings', label: '⚙️ Update Settings', bg: '#f0fdf4' },
            ].map(item => (
              <Link key={item.to} to={item.to}
                style={{ display: 'block', padding: '12px 16px', background: item.bg, borderRadius: '8px', textDecoration: 'none', color: '#1a0a00', fontWeight: '500', fontSize: '0.9rem', transition: 'opacity 0.2s' }}>
                {item.label}
              </Link>
            ))}
          </div>
          <div style={{ marginTop: '20px', padding: '14px', background: '#FDF6EC', borderRadius: '8px', border: '1px solid #e8d5c4' }}>
            <p style={{ fontFamily: 'Hind Siliguri, sans-serif', color: '#C0392B', fontWeight: '700', fontSize: '0.9rem', marginBottom: '4px' }}>জয় মা দুর্গা 🙏</p>
            <p style={{ color: '#7a5c4f', fontSize: '0.82rem' }}>Puja {settings.pujaYear || 2025} Admin Panel</p>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){ .dash-grid{grid-template-columns:1fr !important;} }`}</style>
    </div>
  );
}
