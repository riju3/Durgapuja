import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const empty = { title: '', caption: '', category: 'general', year: new Date().getFullYear() };

export default function AdminDownloads() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fetchItems = () => api.get('/downloads').then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { fetchItems(); }, []);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    if (f.type.startsWith('image/')) {
      setFilePreview({ type: 'image', url: URL.createObjectURL(f), name: f.name, size: `${(f.size / 1024).toFixed(1)} KB` });
    } else {
      setFilePreview({ type: 'file', name: f.name, size: `${(f.size / 1024).toFixed(1)} KB` });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0]; if (f) handleFile(f);
  };

  const startEdit = (item) => {
    setEditing(item._id);
    setForm({ title: item.title, caption: item.caption || '', category: item.category || 'general', year: item.year });
    setFilePreview(item.fileUrl ? { type: item.type === 'image' ? 'image' : 'file', url: item.fileUrl, name: item.fileName || '' } : null);
    setFile(null); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('file', file);
    try {
      if (editing) {
        await api.put(`/downloads/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Updated successfully!');
      } else {
        await api.post('/downloads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Item added! 🎉');
      }
      setForm(empty); setFile(null); setFilePreview(null); setEditing(null); setShowForm(false);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try { await api.delete(`/downloads/${id}`); toast.success('Deleted'); fetchItems(); }
    catch { toast.error('Delete failed'); }
  };

  const typeIcon = { image: '🖼️', pdf: '📄', doc: '📝', caption_only: '📌' };
  const typeColor = { image: '#2980b9', pdf: '#C0392B', doc: '#27ae60', caption_only: '#D4AF37' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#1a0a00', fontSize: '1.8rem', margin: 0 }}>Downloads Manager</h2>
          <p style={{ color: '#7a5c4f', fontSize: '0.85rem', marginTop: '4px' }}>Upload PDFs, images, documents or notices for public download</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty); setFilePreview(null); setFile(null); }} style={btnPrimary}>
          {showForm ? '✕ Cancel' : '+ Add New Item'}
        </button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div style={card}>
          <h3 style={cardTitle}>{editing ? '✏️ Edit Item' : '➕ Add New Download Item'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="form-grid">
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Title * <span style={{ color: '#7a5c4f', fontWeight: '400' }}>(shown on card)</span></label>
                <input style={inp} required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Puja Schedule 2025, Notice from Committee..." />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Caption / Description <span style={{ color: '#7a5c4f', fontWeight: '400' }}>(Bengali or English)</span></label>
                <textarea style={{ ...inp, resize: 'vertical' }} rows={3} value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} placeholder="Add a description or notice text here... (supports Bengali)" />
              </div>
              <div>
                <label style={lbl}>Category</label>
                <select style={inp} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  <option value="general">General</option>
                  <option value="notice">Notice</option>
                  <option value="schedule">Schedule</option>
                  <option value="photos">Photos</option>
                  <option value="forms">Forms</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Year</label>
                <input style={inp} type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} />
              </div>
            </div>

            {/* File Drop Zone */}
            <div>
              <label style={lbl}>File <span style={{ color: '#7a5c4f', fontWeight: '400' }}>(optional — image, PDF, doc up to 20MB)</span></label>
              <div
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                style={{
                  border: `2px dashed ${dragOver ? '#C0392B' : '#e8d5c4'}`,
                  borderRadius: '10px', padding: '30px 20px', textAlign: 'center',
                  background: dragOver ? '#fef3f2' : '#fafafa', cursor: 'pointer',
                  transition: 'all 0.2s', marginBottom: '12px',
                }}
                onClick={() => document.getElementById('fileInput').click()}>
                <input id="fileInput" type="file" style={{ display: 'none' }}
                  accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.pptx"
                  onChange={e => handleFile(e.target.files[0])} />
                {filePreview ? (
                  <div>
                    {filePreview.type === 'image'
                      ? <img src={filePreview.url} alt="Preview" style={{ height: '120px', borderRadius: '8px', objectFit: 'contain', marginBottom: '8px' }} />
                      : <div style={{ fontSize: '3rem', marginBottom: '8px' }}>📄</div>
                    }
                    <p style={{ color: '#1a0a00', fontWeight: '600', fontSize: '0.9rem' }}>{filePreview.name}</p>
                    {filePreview.size && <p style={{ color: '#7a5c4f', fontSize: '0.78rem' }}>{filePreview.size}</p>}
                    <p style={{ color: '#C0392B', fontSize: '0.78rem', marginTop: '6px' }}>Click to change file</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📁</p>
                    <p style={{ color: '#3d2b1f', fontWeight: '600', marginBottom: '4px' }}>Drag & Drop or Click to Upload</p>
                    <p style={{ color: '#7a5c4f', fontSize: '0.82rem' }}>Supports: JPG, PNG, PDF, DOC, DOCX, XLSX, PPTX (max 20MB)</p>
                    <p style={{ color: '#aaa', fontSize: '0.78rem', marginTop: '6px' }}>Leave empty to post caption/notice only</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" disabled={saving} style={btnPrimary}>{saving ? 'Saving...' : editing ? '💾 Update' : '✅ Add Item'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(empty); setFilePreview(null); }} style={btnSecondary}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {items.length === 0
          ? (
            <div style={{ ...card, textAlign: 'center', padding: '50px' }}>
              <p style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</p>
              <p style={{ color: '#7a5c4f', fontSize: '1rem' }}>No downloads added yet. Click "Add New Item" to start!</p>
            </div>
          )
          : items.map(item => (
            <div key={item._id} style={{ ...card, marginBottom: 0, display: 'grid', gridTemplateColumns: item.type === 'image' && item.fileUrl ? '100px 1fr auto' : '52px 1fr auto', gap: '16px', alignItems: 'center' }}>
              {/* Icon / thumb */}
              {item.type === 'image' && item.fileUrl
                ? <img src={item.fileUrl} alt={item.title} style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                : <div style={{ width: '52px', height: '52px', background: `${typeColor[item.type] || '#D4AF37'}18`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
                    {typeIcon[item.type] || '📌'}
                  </div>
              }
              {/* Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <h4 style={{ color: '#1a0a00', fontWeight: '700', fontSize: '0.95rem', margin: 0 }}>{item.title}</h4>
                  <span style={{ background: `${typeColor[item.type]}18`, color: typeColor[item.type], padding: '2px 10px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: '700' }}>
                    {typeIcon[item.type]} {item.type?.replace('_', ' ')}
                  </span>
                </div>
                {item.caption && <p style={{ color: '#7a5c4f', fontSize: '0.82rem', margin: '2px 0 4px' }}>{item.caption.slice(0, 80)}{item.caption.length > 80 ? '...' : ''}</p>}
                <div style={{ display: 'flex', gap: '14px' }}>
                  {item.fileName && <span style={{ color: '#aaa', fontSize: '0.75rem' }}>📎 {item.fileName}</span>}
                  {item.fileSize && <span style={{ color: '#aaa', fontSize: '0.75rem' }}>{item.fileSize}</span>}
                  <span style={{ color: '#aaa', fontSize: '0.75rem' }}>⬇️ {item.downloadCount || 0} downloads</span>
                </div>
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '80px' }}>
                <button onClick={() => startEdit(item)} style={{ ...btnSecondary, padding: '7px 14px', fontSize: '0.8rem' }}>✏️ Edit</button>
                <button onClick={() => handleDelete(item._id)} style={{ padding: '7px 14px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>🗑️ Delete</button>
              </div>
            </div>
          ))
        }
      </div>
      <style>{`@media(max-width:600px){ .form-grid{grid-template-columns:1fr !important;} }`}</style>
    </div>
  );
}

const card = { background: '#fff', borderRadius: '12px', padding: '22px', boxShadow: '0 4px 15px rgba(0,0,0,0.07)', marginBottom: '16px' };
const cardTitle = { color: '#1a0a00', fontSize: '1.05rem', fontWeight: '700', marginBottom: '18px' };
const lbl = { display: 'block', fontWeight: '600', color: '#3d2b1f', marginBottom: '6px', fontSize: '0.85rem' };
const inp = { width: '100%', padding: '10px 12px', border: '2px solid #e8d5c4', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };
const btnPrimary = { padding: '10px 24px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' };
const btnSecondary = { padding: '10px 24px', background: '#fff', color: '#C0392B', border: '2px solid #C0392B', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' };
