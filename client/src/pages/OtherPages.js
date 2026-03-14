// About Page
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import banner from '../assets/banner.webp';
import slide1 from '../assets/slide1.jpg';

export function About() {
  const [settings, setSettings] = useState({});
  useEffect(() => { api.get('/settings').then(r => setSettings(r.data)).catch(() => {}); }, []);

  return (
    <div>
      <section style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img src={banner} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#fff', fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900' }}>About Us</h1>
        </div>
      </section>
      <section style={{ padding: '70px 0', background: '#FDF6EC' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }} className="about-grid">
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#C0392B', marginBottom: '20px' }}>
                Chowdhury Bari Durga Utsav
              </h2>
              <p style={{ color: '#3d2b1f', lineHeight: 1.9, marginBottom: '20px', fontSize: '0.95rem' }}>
                {settings.aboutText || 'Celebrate the divine energy of Durga Maa with Chowdhurybati Durga Puja. Where every moment is a joyous embrace of heritage and festivity.'}
              </p>
              <p style={{ fontFamily: 'Hind Siliguri, sans-serif', color: '#3d2b1f', lineHeight: 2, fontSize: '0.92rem' }}>
                {settings.aboutTextBn || 'প্রতি বছর দুর্গাপূজা উপলক্ষে চৌধুরীবাটিতে আয়োজিত হয় এই মহোৎসব। সংস্কৃতি, ঐতিহ্য ও আনন্দের এক অপূর্ব মিলনমেলা। প্রজন্মের পর প্রজন্ম ধরে এই উৎসব আমাদের একত্রিত করে আসছে।'}
              </p>
            </div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
              <img src={slide1} alt="About" style={{ width: '100%', height: '380px', objectFit: 'cover' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '60px' }} className="stats-grid">
            {[['300+', 'Years of Celebration'], ['50+', 'Families United'], ['7', 'Days of Festivity']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', borderTop: '4px solid #C0392B' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', color: '#C0392B', fontWeight: '900' }}>{num}</h3>
                <p style={{ color: '#7a5c4f', fontWeight: '500', marginTop: '8px' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style>{`@media(max-width:768px){ .about-grid,.stats-grid{grid-template-columns:1fr !important;} }`}</style>
    </div>
  );
}

// Events Page
export function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events').then(r => { setEvents(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const defaultEvents = [
    { name: 'Mahalaya', nameBn: 'মহালয়া', date: '02 Oct 2025', description: 'The beginning of Devi Paksha, marking the arrival of Maa Durga.' },
    { name: 'Maha Panchami', nameBn: 'মহা পঞ্চমী', date: '06 Oct 2025', description: 'Bodhon of Maa Durga — the divine awakening ceremony.' },
    { name: 'Maha Sasthi', nameBn: 'মহা ষষ্ঠী', date: '09 Oct 2025', description: 'Amantran and Adhivas — welcoming the Goddess with devotion.' },
    { name: 'Maha Saptami', nameBn: 'মহা সপ্তমী', date: '10 Oct 2025', description: 'Nabapatrika Snan and Saptami Puja with full rituals.' },
    { name: 'Maha Astami', nameBn: 'মহা অষ্টমী', date: '11 Oct 2025', description: 'Sandhi Puja at the junction of Astami and Navami — the most sacred.' },
    { name: 'Maha Navami', nameBn: 'মহা নবমী', date: '12 Oct 2025', description: 'Navami Puja and Kumari Puja — worshipping the divine feminine.' },
    { name: 'Maha Dashami', nameBn: 'মহা দশমী', date: '13 Oct 2025', description: 'Sindoor Khela and Visarjan — bidding farewell to Maa Durga.' },
  ];

  const displayEvents = events.length > 0 ? events : defaultEvents;

  return (
    <div>
      <section style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img src={banner} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#fff', fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900' }}>Events</h1>
        </div>
      </section>
      <section style={{ padding: '70px 0', background: '#FDF6EC' }}>
        <div className="container">
          <h2 className="section-title">Puja Schedule {new Date().getFullYear()}</h2>
          {loading ? <p style={{ textAlign: 'center', color: '#C0392B' }}>Loading...</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
              {displayEvents.map((ev, i) => (
                <div key={ev._id || i} style={{
                  display: 'grid', gridTemplateColumns: ev.image ? '200px 1fr' : '1fr',
                  gap: '0', borderRadius: '12px', overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)', background: '#fff',
                }}>
                  {ev.image && <img src={ev.image} alt={ev.name} style={{ height: '150px', objectFit: 'cover' }} />}
                  <div style={{ padding: '24px 28px', borderLeft: `5px solid ${i % 2 === 0 ? '#C0392B' : '#D4AF37'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                      <div>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#1a0a00' }}>{ev.name}</h3>
                        <p style={{ fontFamily: 'Hind Siliguri, sans-serif', color: '#C0392B', fontWeight: '600' }}>{ev.nameBn}</p>
                      </div>
                      <span style={{ background: '#C0392B', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap' }}>
                        {ev.date}
                      </span>
                    </div>
                    <p style={{ color: '#7a5c4f', fontSize: '0.9rem', lineHeight: 1.7 }}>{ev.description}</p>
                    {ev.descriptionBn && <p style={{ fontFamily: 'Hind Siliguri, sans-serif', color: '#3d2b1f', fontSize: '0.87rem', marginTop: '8px', lineHeight: 1.8 }}>{ev.descriptionBn}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import bannerImg from '../assets/banner.webp';

// Team Page
export function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/team').then(r => { setTeam(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  return (
    <div>
      <section style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img src={bannerImg} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#fff', fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900' }}>Our Team</h1>
        </div>
      </section>
      <section style={{ padding: '70px 0', background: '#FDF6EC' }}>
        <div className="container">
          <h2 className="section-title">The Organizing Team</h2>
          {loading ? <p style={{ textAlign: 'center', color: '#C0392B', marginTop: '40px' }}>Loading...</p>
            : team.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#7a5c4f', marginTop: '40px', fontSize: '1.05rem' }}>Team info coming soon! 🙏</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '28px', marginTop: '40px' }}>
                {team.map(m => (
                  <div key={m._id} style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', textAlign: 'center', transition: 'transform 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ height: '200px', overflow: 'hidden', background: '#f0e0d0' }}>
                      {m.image ? <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: '#C0392B' }}>🙏</div>}
                    </div>
                    <div style={{ padding: '18px 16px' }}>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#1a0a00', fontSize: '1.05rem', marginBottom: '4px' }}>{m.name}</h3>
                      <p style={{ color: '#C0392B', fontWeight: '600', fontSize: '0.85rem' }}>{m.role}</p>
                      {m.roleBn && <p style={{ fontFamily: 'Hind Siliguri, sans-serif', color: '#7a5c4f', fontSize: '0.82rem', marginTop: '2px' }}>{m.roleBn}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </section>
    </div>
  );
}

// Contact Page
export function Contact() {
  const [settings, setSettings] = useState({});
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { api.get('/settings').then(r => setSettings(r.data)).catch(() => {}); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true); setError('');
    try {
      await api.post('/contact', form);
      setSent(true); setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Failed to send. Please try again.');
    } finally { setSending(false); }
  };

  return (
    <div>
      <section style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img src={bannerImg} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#fff', fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900' }}>Contact</h1>
        </div>
      </section>
      <section style={{ padding: '70px 0', background: '#FDF6EC' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }} className="contact-grid">
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#C0392B', marginBottom: '30px' }}>Reach Out to Us</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <InfoBox icon="📧" label="Email" value={settings.email || 'chowdhurybatidurgautsav@gmail.com'} />
                <InfoBox icon="📍" label="Address" value={settings.address || 'Durgapur, West Bengal'} valueBn={settings.addressBn} />
                {settings.phone && <InfoBox icon="📞" label="Phone" value={settings.phone} />}
              </div>
            </div>
            <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#1a0a00', marginBottom: '24px' }}>Send us a Message</h3>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🙏</div>
                  <h4 style={{ color: '#C0392B', fontSize: '1.2rem', marginBottom: '8px' }}>Message Sent!</h4>
                  <p style={{ color: '#7a5c4f' }}>Thank you for reaching out. We will get back to you soon.</p>
                  <button onClick={() => setSent(false)} style={{ marginTop: '20px', padding: '10px 24px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {[['Name', 'name', 'text'], ['Email', 'email', 'email']].map(([label, field, type]) => (
                    <div key={field}>
                      <label style={labelStyle}>{label}</label>
                      <input type={type} required value={form[field]}
                        onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                        style={inputStyle} placeholder={`Your ${label}`} />
                    </div>
                  ))}
                  <div>
                    <label style={labelStyle}>Message</label>
                    <textarea required rows={5} value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      style={{ ...inputStyle, resize: 'vertical' }} placeholder="Your message..." />
                  </div>
                  {error && <p style={{ color: '#C0392B', fontSize: '0.85rem' }}>{error}</p>}
                  <button type="submit" disabled={sending}
                    style={{ padding: '14px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', opacity: sending ? 0.7 : 1 }}>
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <style>{`@media(max-width:768px){ .contact-grid{grid-template-columns:1fr !important;} }`}</style>
    </div>
  );
}

function InfoBox({ icon, label, value, valueBn }) {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '20px', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <div>
        <p style={{ fontWeight: '700', color: '#1a0a00', marginBottom: '4px' }}>{label}</p>
        <p style={{ color: '#7a5c4f', fontSize: '0.9rem' }}>{value}</p>
        {valueBn && <p style={{ fontFamily: 'Hind Siliguri, sans-serif', color: '#7a5c4f', fontSize: '0.87rem', marginTop: '2px' }}>{valueBn}</p>}
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontWeight: '600', color: '#3d2b1f', marginBottom: '6px', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '12px 14px', border: '2px solid #e8d5c4', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' };
