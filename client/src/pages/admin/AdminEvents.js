import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const empty = { name: '', nameBn: '', date: '', description: '', descriptionBn: '', year: new Date().getFullYear(), order: 0 };

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchEvents = () => api.get('/events').then(r => setEvents(r.data)).catch(() => {});
  useEffect(() => { fetchEvents(); }, []);

  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setFile(f); setPreview(URL.createObjectURL(f));
  };

  const startEdit = (ev) => {
    setEditing(ev._id);
    setForm({ name: ev.name, nameBn: ev.nameBn || '', date: ev.date, description: ev.description || '', descriptionBn: ev.descriptionBn || '', year: ev.year, order: ev.order });
    setPreview(ev.image || null); setFile(null); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);
    try {
      if (editing) {
        await api.put(`/events/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Event updated!');
      } else {
        await api.post('/events', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Event added!');
      }
      setForm(empty); setFile(null); setPreview(null); setEditing(null); setShowForm(false);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try { await api.delete(`/events/${id}`); toast.success('Deleted'); fetchEvents(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={pageTitle}>Puja Days / Events</h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty); setPreview(null); setFile(null); }} style={btnPrimary}>
          {showForm ? '✕ Cancel' : '+ Add Puja Day'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={card}>
          <h3 style={cardTitle}>{editing ? '✏️ Edit Event' : '➕ Add New Puja Day'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid">
              <div><label style={lbl}>Event Name (English) *</label><input style={inp} required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Maha Saptami" /></div>
              <div><label style={lbl}>নাম (বাংলা)</label><input style={inp} value={form.nameBn} onChange={e => setForm(p => ({ ...p, nameBn: e.target.value }))} placeholder="মহা সপ্তমী" className="bengali" /></div>
              <div><label style={lbl}>Date *</label><input style={inp} required value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} placeholder="10 Oct 2025" /></div>
              <div><label style={lbl}>Year</label><input style={inp} type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Description (English)</label><textarea style={{ ...inp, resize: 'vertical' }} rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe this puja day..." /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>বিবরণ (বাংলা)</label><textarea style={{ ...inp, resize: 'vertical' }} rows={3} value={form.descriptionBn} onChange={e => setForm(p => ({ ...p, descriptionBn: e.target.value }))} className="bengali" placeholder="পূজার বিবরণ..." /></div>
              <div><label style={lbl}>Photo</label><input type="file" accept="image/*" onChange={handleFile} style={{ ...inp, padding: '8px' }} /></div>
              <div><label style={lbl}>Display Order</label><input style={inp} type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: e.target.value }))} /></div>
            </div>
            {preview && <img src={preview} alt="Preview" style={{ height: '120px', borderRadius: '8px', objectFit: 'cover', marginTop: '12px', marginBottom: '16px' }} />}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit" disabled={saving} style={btnPrimary}>{saving ? 'Saving...' : editing ? '💾 Update' : '✅ Add Event'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(empty); }} style={btnSecondary}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {events.length === 0
          ? <p style={{ color: '#7a5c4f', textAlign: 'center', padding: '40px' }}>No events yet. Add your first puja day!</p>
          : events.map(ev => (
            <div key={ev._id} style={{ ...card, marginBottom: 0, display: 'grid', gridTemplateColumns: ev.image ? '120px 1fr auto' : '1fr auto', gap: '16px', alignItems: 'center' }}>
              {ev.image && <img src={ev.image} alt={ev.name} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />}
              <div>
                <h4 style={{ color: '#1a0a00', fontWeight: '700', marginBottom: '2px' }}>{ev.name}</h4>
                <p style={{ fontFamily: 'Hind Siliguri, sans-serif', color: '#C0392B', fontSize: '0.88rem' }}>{ev.nameBn}</p>
                <span style={{ background: '#fef3f2', color: '#C0392B', padding: '2px 10px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: '600' }}>{ev.date}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => startEdit(ev)} style={{ ...btnSecondary, padding: '7px 16px', fontSize: '0.82rem' }}>✏️ Edit</button>
                <button onClick={() => handleDelete(ev._id)} style={{ background: '#C0392B', color: '#fff', border: 'none', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' }}>🗑️ Delete</button>
              </div>
            </div>
          ))
        }
      </div>
      <style>{`@media(max-width:600px){ .form-grid{grid-template-columns:1fr !important;} }`}</style>
    </div>
  );
}

const pageTitle = { fontFamily: 'Playfair Display, serif', color: '#1a0a00', fontSize: '1.8rem', margin: 0 };
const card = { background: '#fff', borderRadius: '12px', padding: '22px', boxShadow: '0 4px 15px rgba(0,0,0,0.07)', marginBottom: '16px' };
const cardTitle = { color: '#1a0a00', fontSize: '1.05rem', fontWeight: '700', marginBottom: '18px' };
const lbl = { display: 'block', fontWeight: '600', color: '#3d2b1f', marginBottom: '5px', fontSize: '0.85rem' };
const inp = { width: '100%', padding: '10px 12px', border: '2px solid #e8d5c4', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };
const btnPrimary = { padding: '10px 24px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' };
const btnSecondary = { padding: '10px 24px', background: '#fff', color: '#C0392B', border: '2px solid #C0392B', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' };
