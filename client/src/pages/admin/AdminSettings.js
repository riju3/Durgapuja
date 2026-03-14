import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function AdminSettings() {
  const [form, setForm] = useState({
    pujaYear: 2025, youtubeUrl: '', address: '', addressBn: '',
    email: '', phone: '', facebook: '', instagram: '', youtube: '',
    aboutText: '', aboutTextBn: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings').then(r => setForm(r.data)).catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.put('/settings', form);
      toast.success('Settings saved! 🙏');
    } catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  const Field = ({ label, field, type = 'text', placeholder = '', bengali = false, rows }) => (
    <div>
      <label style={lbl}>{label}</label>
      {rows
        ? <textarea style={{ ...inp, resize: 'vertical' }} rows={rows} value={form[field] || ''} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} placeholder={placeholder} className={bengali ? 'bengali' : ''} />
        : <input type={type} style={inp} value={form[field] || ''} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} placeholder={placeholder} className={bengali ? 'bengali' : ''} />
      }
    </div>
  );

  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#1a0a00', fontSize: '1.8rem', marginBottom: '24px' }}>Website Settings</h2>
      <form onSubmit={handleSave}>

        {/* General */}
        <div style={card}>
          <h3 style={cardTitle}>⚙️ General Settings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="settings-grid">
            <Field label="Puja Year" field="pujaYear" type="number" placeholder="2025" />
            <Field label="Contact Email" field="email" type="email" placeholder="your@email.com" />
            <Field label="Phone" field="phone" placeholder="+91 XXXXX XXXXX" />
            <Field label="YouTube Embed URL" field="youtubeUrl" placeholder="https://www.youtube.com/embed/..." />
          </div>
        </div>

        {/* Address */}
        <div style={card}>
          <h3 style={cardTitle}>📍 Address</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="settings-grid">
            <Field label="Address (English)" field="address" placeholder="Chowdhurybati, Durgapur, West Bengal" />
            <Field label="ঠিকানা (বাংলা)" field="addressBn" placeholder="চৌধুরীবাটি, দুর্গাপুর, পশ্চিমবঙ্গ" bengali />
          </div>
        </div>

        {/* About Text */}
        <div style={card}>
          <h3 style={cardTitle}>📝 About Text</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Field label="About Text (English)" field="aboutText" rows={4} placeholder="Describe your puja..." />
            <Field label="পরিচিতি (বাংলা)" field="aboutTextBn" rows={4} bengali placeholder="পূজার পরিচিতি..." />
          </div>
        </div>

        {/* Social */}
        <div style={card}>
          <h3 style={cardTitle}>🌐 Social Media Links</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="settings-grid">
            <Field label="Facebook URL" field="facebook" placeholder="https://facebook.com/..." />
            <Field label="Instagram URL" field="instagram" placeholder="https://instagram.com/..." />
            <Field label="YouTube Channel URL" field="youtube" placeholder="https://youtube.com/..." />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" disabled={saving}
            style={{ padding: '13px 36px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : '💾 Save All Settings'}
          </button>
        </div>
      </form>
      <style>{`@media(max-width:600px){ .settings-grid{grid-template-columns:1fr !important;} }`}</style>
    </div>
  );
}

const card = { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.07)', marginBottom: '22px' };
const cardTitle = { color: '#1a0a00', fontSize: '1.05rem', fontWeight: '700', marginBottom: '18px' };
const lbl = { display: 'block', fontWeight: '600', color: '#3d2b1f', marginBottom: '6px', fontSize: '0.85rem' };
const inp = { width: '100%', padding: '10px 12px', border: '2px solid #e8d5c4', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };
