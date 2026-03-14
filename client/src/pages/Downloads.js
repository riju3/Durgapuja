import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import banner from '../assets/banner.webp';

const typeIcon = { image: '🖼️', pdf: '📄', doc: '📝', caption_only: '📌' };
const typeLabel = { image: 'Image', pdf: 'PDF', doc: 'Document', caption_only: 'Notice' };
const typeColor = { image: '#2980b9', pdf: '#C0392B', doc: '#27ae60', caption_only: '#D4AF37' };

export default function Downloads() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.get('/downloads').then(r => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDownload = async (item) => {
    try {
      await api.patch(`/downloads/${item._id}/download`);
      // Open file in new tab for download
      const link = document.createElement('a');
      link.href = item.fileUrl;
      link.target = '_blank';
      link.download = item.fileName || item.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Update local count
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, downloadCount: (i.downloadCount || 0) + 1 } : i));
    } catch { window.open(item.fileUrl, '_blank'); }
  };

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);

  return (
    <div>
      {/* Hero */}
      <section style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img src={banner} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
          <h1 style={{ color: '#fff', fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: '900' }}>Downloads</h1>
          <p style={{ color: '#F0D060', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '1rem' }}>নোটিশ, ছবি ও নথি</p>
        </div>
      </section>

      <section style={{ padding: '60px 0', background: '#FDF6EC', minHeight: '60vh' }}>
        <div className="container">

          {/* Filter tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {[['all', 'All', '📋'], ['image', 'Images', '🖼️'], ['pdf', 'PDFs', '📄'], ['doc', 'Docs', '📝'], ['caption_only', 'Notices', '📌']].map(([val, label, icon]) => (
              <button key={val} onClick={() => setFilter(val)}
                style={{
                  padding: '9px 22px', border: '2px solid #C0392B', borderRadius: '30px',
                  cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem', transition: 'all 0.2s',
                  background: filter === val ? '#C0392B' : '#fff',
                  color: filter === val ? '#fff' : '#C0392B',
                }}>
                {icon} {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#C0392B', fontSize: '1.2rem' }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <p style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</p>
              <p style={{ color: '#7a5c4f', fontSize: '1.05rem' }}>No items found in this category.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '22px' }}>
              {filtered.map(item => (
                <div key={item._id} style={{
                  background: '#fff', borderRadius: '14px',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.09)',
                  overflow: 'hidden', transition: 'transform 0.25s, box-shadow 0.25s',
                  border: '1px solid #f0e0d0',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.13)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.09)'; }}>

                  {/* Image preview */}
                  {item.type === 'image' && item.fileUrl && (
                    <div onClick={() => setLightbox(item)} style={{ cursor: 'zoom-in', height: '180px', overflow: 'hidden', background: '#f0e0d0' }}>
                      <img src={item.fileUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                    </div>
                  )}

                  {/* PDF/Doc preview */}
                  {(item.type === 'pdf' || item.type === 'doc') && (
                    <div style={{ height: '100px', background: `linear-gradient(135deg, ${typeColor[item.type]}22, ${typeColor[item.type]}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
                      {typeIcon[item.type]}
                    </div>
                  )}

                  {/* Caption only */}
                  {item.type === 'caption_only' && (
                    <div style={{ height: '80px', background: 'linear-gradient(135deg, #D4AF3722, #D4AF3744)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                      📌
                    </div>
                  )}

                  <div style={{ padding: '18px' }}>
                    {/* Type badge */}
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem',
                      fontWeight: '700', marginBottom: '8px', letterSpacing: '0.5px',
                      background: `${typeColor[item.type]}18`, color: typeColor[item.type],
                      border: `1px solid ${typeColor[item.type]}44`,
                    }}>
                      {typeIcon[item.type]} {typeLabel[item.type]}
                    </span>

                    <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#1a0a00', fontSize: '1rem', marginBottom: '8px', lineHeight: 1.4 }}>{item.title}</h3>

                    {item.caption && (
                      <p style={{ color: '#7a5c4f', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '12px', fontFamily: item.caption.match(/[\u0980-\u09FF]/) ? 'Hind Siliguri, sans-serif' : 'inherit' }}>
                        {item.caption}
                      </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f0e0d0' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ color: '#aaa', fontSize: '0.75rem' }}>{new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {item.fileSize && <span style={{ color: '#bbb', fontSize: '0.72rem' }}>{item.fileSize}</span>}
                      </div>
                      {item.fileUrl && item.type !== 'caption_only' ? (
                        <button onClick={() => handleDownload(item)}
                          style={{
                            padding: '7px 16px', background: '#C0392B', color: '#fff',
                            border: 'none', borderRadius: '8px', cursor: 'pointer',
                            fontWeight: '700', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px',
                          }}>
                          ⬇️ Download {item.downloadCount > 0 && <span style={{ opacity: 0.75, fontSize: '0.72rem' }}>({item.downloadCount})</span>}
                        </button>
                      ) : item.type === 'image' ? (
                        <button onClick={() => setLightbox(item)}
                          style={{ padding: '7px 16px', background: '#2980b9', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem' }}>
                          🔍 View
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox for images */}
      {lightbox && (
        <div onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.93)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', flexDirection: 'column', gap: '16px' }}>
          <img src={lightbox.fileUrl} alt={lightbox.title}
            style={{ maxHeight: '75vh', maxWidth: '90vw', borderRadius: '10px', objectFit: 'contain' }}
            onClick={e => e.stopPropagation()} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>{lightbox.title}</p>
            {lightbox.caption && <p style={{ color: '#ccc', fontSize: '0.9rem', marginTop: '4px' }}>{lightbox.caption}</p>}
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleDownload(lightbox); }}
            style={{ padding: '10px 28px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.95rem' }}>
            ⬇️ Download Image
          </button>
          <button onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>
      )}
    </div>
  );
}
