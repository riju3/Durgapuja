import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function AdminGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ caption: '', year: new Date().getFullYear(), category: 'general' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [yearFilter, setYearFilter] = useState('');

  const fetchPhotos = () => {
    setLoading(true);
    const q = yearFilter ? `?year=${yearFilter}` : '';
    api.get(`/gallery${q}`).then(r => { setPhotos(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchPhotos(); }, [yearFilter]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a photo'); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    fd.append('caption', form.caption);
    fd.append('year', form.year);
    fd.append('category', form.category);
    try {
      await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Photo uploaded! 🎉');
      setFile(null); setPreview(null);
      setForm({ caption: '', year: new Date().getFullYear(), category: 'general' });
      fetchPhotos();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Photo deleted');
      setPhotos(p => p.filter(ph => ph._id !== id));
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <h2 style={pageTitle}>Gallery Management</h2>

      {/* Upload Form */}
      <div style={card}>
        <h3 style={cardTitle}>📸 Upload New Photo</h3>
        <form onSubmit={handleUpload}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="form-grid">
            <div>
              <label style={label}>Caption</label>
              <input style={input} value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} placeholder="Photo caption..." />
            </div>
            <div>
              <label style={label}>Year</label>
              <input style={input} type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} />
            </div>
            <div>
              <label style={label}>Category</label>
              <select style={input} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                <option value="general">General</option>
                <option value="pratima">Pratima Darshan</option>
                <option value="cultural">Cultural</option>
                <option value="bhog">Bhog</option>
              </select>
            </div>
            <div>
              <label style={label}>Photo *</label>
              <input type="file" accept="image/*" onChange={handleFile} style={{ ...input, padding: '8px' }} />
            </div>
          </div>
          {preview && (
            <div style={{ marginBottom: '16px' }}>
              <img src={preview} alt="Preview" style={{ height: '160px', borderRadius: '8px', objectFit: 'cover' }} />
            </div>
          )}
          <button type="submit" disabled={uploading} style={btnPrimary}>{uploading ? 'Uploading...' : '⬆️ Upload Photo'}</button>
        </form>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ color: '#7a5c4f', fontWeight: '600' }}>Filter by year:</span>
        {['', 2025, 2024, 2023, 2022].map(y => (
          <button key={y} onClick={() => setYearFilter(y)}
            style={{ padding: '6px 18px', border: '2px solid #C0392B', borderRadius: '20px', cursor: 'pointer', background: yearFilter == y ? '#C0392B' : '#fff', color: yearFilter == y ? '#fff' : '#C0392B', fontWeight: '600', fontSize: '0.85rem' }}>
            {y || 'All'}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      {loading ? <p style={{ color: '#C0392B', textAlign: 'center', padding: '40px' }}>Loading...</p>
        : photos.length === 0 ? <p style={{ color: '#7a5c4f', textAlign: 'center', padding: '40px' }}>No photos uploaded yet.</p>
        : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {photos.map(p => (
              <div key={p._id} style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 3px 12px rgba(0,0,0,0.1)', background: '#fff', position: 'relative' }}>
                <img src={p.url} alt={p.caption} style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '10px' }}>
                  <p style={{ fontSize: '0.78rem', color: '#7a5c4f', marginBottom: '6px' }}>{p.caption || 'No caption'}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', background: '#fef3f2', color: '#C0392B', padding: '2px 8px', borderRadius: '10px' }}>{p.year}</span>
                    <button onClick={() => handleDelete(p._id)}
                      style={{ background: '#C0392B', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.78rem' }}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      <style>{`@media(max-width:600px){ .form-grid{grid-template-columns:1fr !important;} }`}</style>
    </div>
  );
}

const pageTitle = { fontFamily: 'Playfair Display, serif', color: '#1a0a00', fontSize: '1.8rem', marginBottom: '24px' };
const card = { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.07)', marginBottom: '28px' };
const cardTitle = { color: '#1a0a00', fontSize: '1.05rem', fontWeight: '700', marginBottom: '18px' };
const label = { display: 'block', fontWeight: '600', color: '#3d2b1f', marginBottom: '6px', fontSize: '0.87rem' };
const input = { width: '100%', padding: '10px 12px', border: '2px solid #e8d5c4', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };
const btnPrimary = { padding: '11px 28px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' };
