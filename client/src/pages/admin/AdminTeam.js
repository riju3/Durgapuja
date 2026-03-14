import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const empty = { name: '', role: '', roleBn: '', order: 0 };

export default function AdminTeam() {
  const [team, setTeam] = useState([]);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchTeam = () => api.get('/team').then(r => setTeam(r.data)).catch(() => {});
  useEffect(() => { fetchTeam(); }, []);

  const handleFile = (e) => { const f = e.target.files[0]; if (!f) return; setFile(f); setPreview(URL.createObjectURL(f)); };

  const startEdit = (m) => {
    setEditing(m._id);
    setForm({ name: m.name, role: m.role, roleBn: m.roleBn || '', order: m.order });
    setPreview(m.image || null); setFile(null); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);
    try {
      if (editing) { await api.put(`/team/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('Updated!'); }
      else { await api.post('/team', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('Member added!'); }
      setForm(empty); setFile(null); setPreview(null); setEditing(null); setShowForm(false); fetchTeam();
    } catch (err) { toast.error('Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this team member?')) return;
    try { await api.delete(`/team/${id}`); toast.success('Removed'); fetchTeam(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#1a0a00', fontSize: '1.8rem', margin: 0 }}>Team Management</h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty); setPreview(null); setFile(null); }} style={btnPrimary}>
          {showForm ? '✕ Cancel' : '+ Add Member'}
        </button>
      </div>

      {showForm && (
        <div style={card}>
          <h3 style={{ color: '#1a0a00', fontWeight: '700', marginBottom: '18px' }}>{editing ? '✏️ Edit Member' : '➕ Add Team Member'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid">
              <div><label style={lbl}>Name *</label><input style={inp} required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" /></div>
              <div><label style={lbl}>Role (English) *</label><input style={inp} required value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="President, Secretary..." /></div>
              <div><label style={lbl}>ভূমিকা (বাংলা)</label><input style={inp} value={form.roleBn} onChange={e => setForm(p => ({ ...p, roleBn: e.target.value }))} placeholder="সভাপতি, সম্পাদক..." className="bengali" /></div>
              <div><label style={lbl}>Order</label><input style={inp} type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: e.target.value }))} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Photo</label><input type="file" accept="image/*" onChange={handleFile} style={{ ...inp, padding: '8px' }} /></div>
            </div>
            {preview && <img src={preview} alt="Preview" style={{ height: '100px', width: '100px', objectFit: 'cover', borderRadius: '50%', marginTop: '12px', marginBottom: '16px' }} />}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit" disabled={saving} style={btnPrimary}>{saving ? 'Saving...' : editing ? '💾 Update' : '✅ Add Member'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(empty); }} style={btnSecondary}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '18px' }}>
        {team.length === 0
          ? <p style={{ color: '#7a5c4f', padding: '40px', gridColumn: '1/-1', textAlign: 'center' }}>No team members yet.</p>
          : team.map(m => (
            <div key={m._id} style={{ ...card, marginBottom: 0, textAlign: 'center', padding: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', background: '#f0e0d0', border: '3px solid #C0392B' }}>
                {m.image ? <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🙏</div>}
              </div>
              <h4 style={{ color: '#1a0a00', fontWeight: '700', marginBottom: '4px', fontSize: '0.95rem' }}>{m.name}</h4>
              <p style={{ color: '#C0392B', fontSize: '0.82rem', fontWeight: '600' }}>{m.role}</p>
              {m.roleBn && <p style={{ fontFamily: 'Hind Siliguri, sans-serif', color: '#7a5c4f', fontSize: '0.78rem' }}>{m.roleBn}</p>}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                <button onClick={() => startEdit(m)} style={{ ...btnSecondary, padding: '6px 14px', fontSize: '0.78rem' }}>✏️</button>
                <button onClick={() => handleDelete(m._id)} style={{ background: '#C0392B', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>🗑️</button>
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
const lbl = { display: 'block', fontWeight: '600', color: '#3d2b1f', marginBottom: '5px', fontSize: '0.85rem' };
const inp = { width: '100%', padding: '10px 12px', border: '2px solid #e8d5c4', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };
const btnPrimary = { padding: '10px 24px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' };
const btnSecondary = { padding: '10px 24px', background: '#fff', color: '#C0392B', border: '2px solid #C0392B', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' };
