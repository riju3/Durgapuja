import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import banner from '../assets/banner.webp';
import slide1 from '../assets/slide1.jpg';
import slide2 from '../assets/slide2.jpg';
import slide3 from '../assets/slide3.jpg';
import slide4 from '../assets/slide4.jpg';
import slide5 from '../assets/slide5.jpg';
import tradition from '../assets/tradition.jpg';
const slides = [slide1, slide2, slide3, slide4, slide5];

const pujadays = [
  { name: 'Mahalaya', nameBn: 'মহালয়া', date: '02 Oct', color: '#C0392B' },
  { name: 'Maha Panchami', nameBn: 'মহা পঞ্চমী', date: '06 Oct', color: '#922b21' },
  { name: 'Maha Sasthi', nameBn: 'মহা ষষ্ঠী', date: '09 Oct', color: '#C0392B' },
  { name: 'Maha Saptami', nameBn: 'মহা সপ্তমী', date: '10 Oct', color: '#922b21' },
  { name: 'Maha Astami', nameBn: 'মহা অষ্টমী', date: '11 Oct', color: '#C0392B' },
  { name: 'Maha Navami', nameBn: 'মহা নবমী', date: '12 Oct', color: '#922b21' },
  { name: 'Maha Dashami', nameBn: 'মহা দশমী', date: '13 Oct', color: '#C0392B', wide: true },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [settings, setSettings] = useState({});
  const [gallery, setGallery] = useState([]);
  const [events, setEvents] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data)).catch(() => {});
    api.get('/gallery?limit=6').then(r => setGallery(r.data.slice(0, 6))).catch(() => {});
    api.get('/events').then(r => setEvents(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div>
      {/* HERO BANNER */}
      <section style={{ position: 'relative', overflow: 'hidden', height: 'clamp(200px, 35vw, 420px)' }}>
        <img src={banner} alt="Chowdhury Bari Banner"
          style={{ width: '100%', height: '80%', objectFit: 'cover', objectPosition: 'center' }} />
      </section>

      {/* WELCOME SECTION - Slides */}
      <section style={{ background: '#fff', padding: '0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '500px' }} className="welcome-grid">
          {/* Left: Welcome text */}
          <div style={{
            background: '#FDF6EC', padding: '60px 50px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Mandala decorations */}
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '180px', height: '180px', opacity: 0.08, background: 'radial-gradient(circle, #C0392B 2px, transparent 2px) 0 0 / 12px 12px' }}></div>
            <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '180px', height: '180px', opacity: 0.08, background: 'radial-gradient(circle, #C0392B 2px, transparent 2px) 0 0 / 12px 12px' }}></div>

            <p style={{ color: '#7a5c4f', fontWeight: '500', marginBottom: '8px', fontSize: '1rem' }}>Welcome to</p>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              color: '#C0392B', fontWeight: '900',
              lineHeight: 1.15, marginBottom: '16px',
              textTransform: 'uppercase',
            }}>
              CHOWDHURYBATI<br />DURGA PUJA
            </h1>
            <p style={{ color: '#7a5c4f', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '30px', maxWidth: '380px' }}>
              Celebrate the divine energy of Durga Maa with Chowdhurybati Durga Puja.
              Where every moment is a joyous embrace of heritage and festivity.
            </p>
            <p style={{ fontFamily: 'Hind Siliguri, sans-serif', color: '#3d2b1f', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: '30px', maxWidth: '380px' }}>
              {settings.aboutTextBn || 'মা দুর্গার দিব্য শক্তির সাথে চৌধুরীবাটি দুর্গাপূজায় যোগ দিন।'}
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/about" className="btn btn-primary">About</Link>
              <Link to="/gallery" className="btn btn-outline">Gallery</Link>
            </div>
          </div>

          {/* Right: Slideshow */}
          <div style={{ position: 'relative', overflow: 'hidden', minHeight: '400px' }}>
            {slides.map((slide, i) => (
              <img key={i} src={slide} alt={`Slide ${i + 1}`}
                style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  objectFit: 'cover',
                  opacity: i === currentSlide ? 1 : 0,
                  transition: 'opacity 1s ease-in-out',
                }} />
            ))}
            {/* Slide dots */}
            <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
              {slides.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)}
                  style={{
                    width: i === currentSlide ? '24px' : '8px', height: '8px',
                    borderRadius: '4px', border: 'none',
                    background: i === currentSlide ? '#C0392B' : 'rgba(255,255,255,0.6)',
                    cursor: 'pointer', transition: 'all 0.3s',
                  }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* YOUTUBE VIDEO SECTION */}
      <section style={{ background: '#FDF6EC', padding: '60px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center' }} className="video-grid container">
          <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', aspectRatio: '16/9' }}>
            <iframe
              width="100%" height="100%"
              src={settings.youtubeUrl || 'https://www.youtube.com/shorts/f_i60KU7nrU?feature=share'}
              title="Durga Puja" frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen style={{ display: 'block' }}
            />
          </div>
          <div>
            <p style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.85rem', color: '#C0392B', fontWeight: '600', marginBottom: '8px' }}>
              এই পুজো সম্পর্কে — Chowdhury Bari Durga Utsav-এ আপনাকে স্বাগতম!
            </p>
            <p style={{ fontFamily: 'Hind Siliguri, sans-serif', color: '#3d2b1f', lineHeight: 1.9, fontSize: '0.92rem' }}>
              {settings.aboutTextBn || 'প্রতি বছর দুর্গাপূজা উপলক্ষে চৌধুরীবাটিতে আয়োজিত হয় এই মহোৎসব। সংস্কৃতি, ঐতিহ্য ও আনন্দের এক অপূর্ব মিলনমেলা।'}
            </p>
          </div>
        </div>
      </section>

      {/* TRADITIONS SECTION */}
      <section style={{ padding: '60px 0', background: '#fff' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center' }} className="tradition-grid container">
          <div style={{ borderRadius: '12px', overflow: 'hidden', height: '320px' }}>
            <img src={tradition} alt="Tradition" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: '#1a0a00', marginBottom: '20px', fontStyle: 'italic' }}>
              Keeping our traditions alive!
            </h2>
            <p style={{ fontFamily: 'Hind Siliguri, sans-serif', color: '#3d2b1f', lineHeight: 1.9, fontSize: '0.9rem', marginBottom: '24px' }}>
              প্রজন্মের পর প্রজন্ম ধরে চৌধুরীবাটিতে দুর্গাপূজার এই ঐতিহ্য অব্যাহত রয়েছে। বিসর্জন, সন্ধিপূজা, কুমারীপূজা — প্রতিটি আচার-অনুষ্ঠানে মিশে আছে আমাদের সংস্কৃতি ও বিশ্বাসের গভীর বন্ধন।
            </p>
            <Link to="/about" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              color: '#C0392B', fontWeight: '600', textDecoration: 'none',
              borderBottom: '2px solid #C0392B', paddingBottom: '2px',
            }}>
              Learn More →
            </Link>
          </div>
        </div>
      </section>

      {/* FESTIVAL HIGHLIGHTS */}
      <section style={{ background: '#F5E6CC', padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#1a0a00', marginBottom: '30px', letterSpacing: '2px', textTransform: 'uppercase' }}>
            FESTIVAL HIGHLIGHTS
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="highlights-grid">
            <div style={{ background: '#C0392B', color: '#fff', padding: '30px 24px', borderRadius: '8px' }}>
              <h3 style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px' }}>প্রতিমা দর্শন</h3>
              <p style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.7 }}>পঞ্চমী থেকে দশমী পর্যন্ত নিখুঁত প্রতিমা দর্শনের সুযোগ</p>
            </div>
            <div style={{ background: '#D4AF37', color: '#1a0a00', padding: '30px 24px', borderRadius: '8px' }}>
              <h3 style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px' }}>সাংস্কৃতিক অনুষ্ঠান</h3>
              <p style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.85rem', opacity: 0.85, lineHeight: 1.7 }}>সঙ্গীত, নৃত্য ও বিভিন্ন সাংস্কৃতিক পরিবেশনা</p>
            </div>
            <div style={{ background: '#FDF6EC', color: '#3d2b1f', padding: '30px 24px', borderRadius: '8px', border: '2px solid #e8c9a0' }}>
              <h3 style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px' }}>ভোগ বিতরণ</h3>
              <p style={{ fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.85rem', color: '#7a5c4f', lineHeight: 1.7 }}>সকল ভক্তদের জন্য প্রসাদ ও ভোগ পরিবেশন</p>
            </div>
          </div>
        </div>
      </section>

      {/* HAPPY DURGA PUJA BANNER */}
      <section style={{ background: '#fff', padding: '50px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }} className="happy-grid container">
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#C0392B', marginBottom: '16px' }}>
              Happy Durga Puja!
            </h2>
            <p style={{ color: '#7a5c4f', lineHeight: 1.8, fontSize: '0.9rem' }}>
              Let's celebrate Puja together. Feel the traditions and blessings of Maa Durga. We welcome everyone to join our festivities and be part of this divine celebration.
            </p>
          </div>
          <div style={{ borderRadius: '12px', overflow: 'hidden', height: '250px' }}>
            <img src={slide3} alt="Happy Durga Puja" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* PUJA DAYS */}
      <section style={{ background: '#FDF6EC', padding: '60px 0' }}>
        <div className="container">
          <h2 className="section-title">Puja Days</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }} className="pujadays-grid">
            {(events.length > 0 ? events : pujadays).slice(0, 6).map((day, i) => (
              <div key={i} style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', background: '#fff' }}>
                <div style={{ height: '160px', overflow: 'hidden', background: '#f0e0d0' }}>
                  {day.image
                    ? <img src={day.image} alt={day.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <img src={slides[i % slides.length]} alt={day.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  }
                </div>
                <div style={{ padding: '14px 16px', background: '#fff' }}>
                  <p style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: '700', color: '#C0392B', fontSize: '0.95rem' }}>
                    {day.nameBn || day.name}|{day.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Wide Dashami */}
          {(events.length === 0) && (
            <div style={{ marginTop: '20px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', background: '#fff' }}>
              <div style={{ height: '220px', overflow: 'hidden' }}>
                <img src={slide2} alt="Maha Dashami" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 20px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'Hind Siliguri, sans-serif', fontWeight: '700', color: '#C0392B', fontSize: '1.1rem' }}>
                  মহা দশমী | 13 Oct
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* JOY MAA DURGA */}
      <section style={{ padding: '60px 0', textAlign: 'center', background: '#fff' }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          color: '#C0392B', fontStyle: 'italic',
          fontWeight: '400',
        }}>
          Joy Maa Durga
        </h2>
      </section>

      {/* CONTACT CTA */}
      <section style={{ background: '#FDF6EC', padding: '60px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#1a0a00', marginBottom: '16px' }}>
            Reach out to us
          </h2>
          <a href={`mailto:${settings.email || 'chowdhurybatidurgautsav@gmail.com'}`}
            style={{ color: '#C0392B', fontSize: '1rem', fontWeight: '500', display: 'block', marginBottom: '24px' }}>
            {settings.email || 'chowdhurybatidurgautsav@gmail.com'}
          </a>
          <Link to="/contact" className="btn btn-primary">Contact Us</Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .welcome-grid, .video-grid, .tradition-grid, .happy-grid { grid-template-columns: 1fr !important; }
          .highlights-grid { grid-template-columns: 1fr !important; }
          .pujadays-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .pujadays-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
