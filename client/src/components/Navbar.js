import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 1000,
    background: 'rgba(255,255,255,0.97)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 20px rgba(192,57,43,0.15)',
    borderBottom: '2px solid #C0392B',
  },
  inner: {
    maxWidth: '1200px', margin: '0 auto', padding: '0 20px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '70px',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none',
    justifyContent: 'flex-start', marginRight: 'auto',
  },
  brandImg: { height: '120px', width: '80px', objectFit: 'contain' },
  brandText: {
    display: 'flex', flexDirection: 'column',
  },
  brandTitle: {
    fontSize: '0.90rem', fontWeight: '700', color: '#C0392B',
    letterSpacing: '0.5px', lineHeight: 1.2,
  },
  brandSub: {
    fontSize: '0.8rem', color: '#7a5c4f', fontFamily: 'Hind Siliguri, sans-serif',
  },
  links: {
    display: 'flex', alignItems: 'center', gap: '4px', listStyle: 'none',
    marginLeft: 'auto',
  },
  hamburger: {
    display: 'none', flexDirection: 'column', gap: '5px',
    cursor: 'pointer', background: 'none', border: 'none', padding: '5px',
  },
  bar: {
    width: '25px', height: '2px', background: '#C0392B', borderRadius: '2px',
    transition: 'all 0.3s',
  },
};

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkStyle = ({ isActive }) => ({
    padding: '6px 14px',
    borderRadius: '4px',
    fontWeight: '500',
    fontSize: '0.9rem',
    color: isActive ? '#fff' : '#3d2b1f',
    background: isActive ? '#C0392B' : 'transparent',
    transition: 'all 0.2s',
    textDecoration: 'none',
    display: 'block',
  });

  return (
    <nav style={{ ...styles.nav, boxShadow: scrolled ? '0 4px 20px rgba(192,57,43,0.2)' : styles.nav.boxShadow }}>
      <div style={styles.inner}>
        <Link to="/" style={styles.brand}>
          <img src={logo} alt="Logo" style={styles.brandImg} />
          <div style={styles.brandText}>
            <span style={styles.brandTitle}>Chowdhury Bari Durga Utsav</span>
            <span style={styles.brandSub} className="bengali">চৌধুরী বাড়ির দুর্গোৎসব</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul style={{ ...styles.links, '@media(max-width:768px)': { display: 'none' } }} className="nav-links">
          {[['/', 'Home'], ['/about', 'About'], ['/events', 'Events'], ['/gallery', 'Gallery'], ['/team', 'Team'], ['/contact', 'Contact'], ['/downloads', 'Downloads']].map(([path, label]) => (
            <li key={path}>
              <NavLink to={path} end={path === '/'} style={navLinkStyle}>{label}</NavLink>
            </li>
          ))}
          {isAdmin && (
            <li><NavLink to="/admin" style={navLinkStyle}>Admin</NavLink></li>
          )}
          {user ? (
            <li>
              <button onClick={() => { logout(); navigate('/'); }}
                style={{ padding: '6px 16px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login" style={{ padding: '6px 16px', background: '#C0392B', color: '#fff', borderRadius: '4px', fontWeight: '600', fontSize: '0.9rem' }}>
                Login
              </Link>
            </li>
          )}
        </ul>

        {/* Hamburger */}
        <button style={styles.hamburger} className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span style={styles.bar}></span>
          <span style={styles.bar}></span>
          <span style={styles.bar}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: '#fff', padding: '16px 20px', borderTop: '1px solid #f0e0d0',
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          {[['/', 'Home'], ['/about', 'About'], ['/events', 'Events'], ['/gallery', 'Gallery'], ['/team', 'Team'], ['/contact', 'Contact'], ['/downloads', 'Downloads']].map(([path, label]) => (
            <NavLink key={path} to={path} end={path === '/'} style={navLinkStyle} onClick={() => setMenuOpen(false)}>{label}</NavLink>
          ))}
          {isAdmin && <NavLink to="/admin" style={navLinkStyle} onClick={() => setMenuOpen(false)}>Admin</NavLink>}
          {user
            ? <button onClick={() => { logout(); navigate('/'); setMenuOpen(false); }} style={{ padding: '8px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Logout</button>
            : <Link to="/login" onClick={() => setMenuOpen(false)} style={{ padding: '8px', background: '#C0392B', color: '#fff', borderRadius: '4px', fontWeight: '600', textAlign: 'center' }}>Login</Link>
          }
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hamburger { display: none !important; }
          .nav-links { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
