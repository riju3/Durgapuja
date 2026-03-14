import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import logo from '../assets/logo.png';

export default function Footer() {
  const [settings, setSettings] = useState({ email: 'chowdhurybatidurgautsav@gmail.com', address: 'Durgapur, West Bengal', facebook: '', instagram: '', youtube: '' });

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data)).catch(() => {});
  }, []);

  return (
    <footer style={{ background: '#1a0a00', color: '#f5e6cc', padding: '50px 0 20px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '40px' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img src={logo} alt="Logo" style={{ height: '50px', width: '50px', objectFit: 'contain' }} />
              <div>
                <div style={{ fontWeight: '700', color: '#F0D060', fontSize: '0.9rem' }}>Chowdhury Bari</div>
                <div style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.85rem', color: '#e8c9a0' }}>দুর্গোৎসব</div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#c9a87c', lineHeight: 1.7 }}>
              Celebrating the divine energy of Maa Durga with love, tradition and festivity every year.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              {settings.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer" style={socialStyle}>f</a>}
              {settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" style={socialStyle}>in</a>}
              {settings.youtube && <a href={settings.youtube} target="_blank" rel="noreferrer" style={{ ...socialStyle, background: '#C0392B' }}>▶</a>}
            </div>
          </div>

          {/* Features/Links */}
          <div>
            <h4 style={headStyle}>Features</h4>
            <ul style={listStyle}>
              {[['/', 'Home'], ['/gallery', 'Gallery'], ['/events', 'Events'], ['/team', 'Team'], ['/contact', 'Contact']].map(([path, label]) => (
                <li key={path}><Link to={path} style={linkStyle}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Latest News */}
          <div>
            <h4 style={headStyle}>Latest News</h4>
            <ul style={listStyle}>
              <li style={{ color: '#c9a87c', fontSize: '0.85rem' }}>Puja {settings.pujaYear || 2025} Preparations</li>
              <li style={{ color: '#c9a87c', fontSize: '0.85rem' }}>Cultural Program Schedule</li>
              <li style={{ color: '#c9a87c', fontSize: '0.85rem' }}>Bhog Distribution Info</li>
              <li style={{ color: '#c9a87c', fontSize: '0.85rem' }}>New Gallery Photos Added</li>
            </ul>
          </div>

          {/* Support/Contact */}
          <div>
            <h4 style={headStyle}>Support</h4>
            <ul style={listStyle}>
              <li><Link to="/contact" style={linkStyle}>Contact</Link></li>
              <li><Link to="/about" style={linkStyle}>About Us</Link></li>
              <li><a href={`mailto:${settings.email}`} style={linkStyle}>{settings.email}</a></li>
            </ul>
            <p style={{ color: '#c9a87c', fontSize: '0.82rem', marginTop: '8px', fontFamily: 'Hind Siliguri, sans-serif' }}>
              {settings.addressBn || 'চৌধুরীবাটি, Dirghagram (দীর্ঘগ্রাম), West Bengal, India'}
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #3d2b1f', paddingTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#7a5c4f', fontSize: '0.82rem' }}>
            © {new Date().getFullYear()} Chowdhury Bari Durga Utsav. All rights reserved. &nbsp;|&nbsp;
            <span style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>জয় মা দুর্গা 🙏</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

const headStyle = { color: '#F0D060', fontSize: '1rem', fontWeight: '700', marginBottom: '14px', letterSpacing: '0.5px' };
const listStyle = { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' };
const linkStyle = { color: '#c9a87c', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' };
const socialStyle = {
  width: '36px', height: '36px', borderRadius: '50%',
  background: '#3d2b1f', color: '#F0D060',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none',
};
