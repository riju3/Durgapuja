import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { to: '/admin/events', label: 'Puja Days', icon: '📅' },
  { to: '/admin/team', label: 'Team', icon: '👥' },
  { to: '/admin/messages', label: 'Messages', icon: '✉️' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
  { to: '/admin/downloads', label: 'Downloads', icon: '📥' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = () => (
    <aside style={{
      width: '240px', minHeight: '100vh', background: '#1a0a00',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #3d2b1f' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logo} alt="Logo" style={{ height: '40px', width: '40px', objectFit: 'contain' }} />
          <div>
            <p style={{ color: '#F0D060', fontWeight: '700', fontSize: '0.85rem', lineHeight: 1.2 }}>Admin Panel</p>
            <p style={{ color: '#c9a87c', fontSize: '0.75rem', fontFamily: 'Hind Siliguri, sans-serif' }}>দুর্গোৎসব</p>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 14px', borderRadius: '8px', textDecoration: 'none',
              color: isActive ? '#fff' : '#c9a87c',
              background: isActive ? '#C0392B' : 'transparent',
              fontWeight: isActive ? '600' : '400',
              fontSize: '0.9rem', transition: 'all 0.2s',
            })}>
            <span>{icon}</span> {label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '16px 12px', borderTop: '1px solid #3d2b1f' }}>
        <div style={{ padding: '10px 14px', marginBottom: '8px' }}>
          <p style={{ color: '#F0D060', fontSize: '0.85rem', fontWeight: '600' }}>{user?.name}</p>
          <p style={{ color: '#7a5c4f', fontSize: '0.75rem' }}>{user?.email}</p>
        </div>
        <button onClick={handleLogout}
          style={{ width: '100%', padding: '10px', background: '#922b21', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem' }}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f0e8' }}>
      {/* Desktop Sidebar */}
      <div className="admin-sidebar-desktop"><Sidebar /></div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex' }}>
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}><Sidebar /></div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <header style={{ background: '#fff', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderBottom: '2px solid #C0392B' }}>
          <button className="admin-hamburger" onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#C0392B', display: 'none' }}>
            ☰
          </button>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#C0392B', fontSize: '1.2rem' }}>
            Chowdhury Bari Admin
          </h1>
          <span style={{ fontSize: '0.85rem', color: '#7a5c4f' }}>Welcome, {user?.name} 🙏</span>
        </header>

        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-hamburger { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
