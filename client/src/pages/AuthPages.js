import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success('Welcome back! 🙏');
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#fff', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', padding: '40px', border: '1px solid #f0e0d0' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src={logo} alt="Logo" style={{ height: '70px', width: '70px', objectFit: 'contain' }} />
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#C0392B', fontSize: '1.8rem', marginTop: '12px' }}>Welcome Back</h2>
          <p style={{ color: '#7a5c4f', fontSize: '0.9rem', fontFamily: 'Hind Siliguri, sans-serif' }}>চৌধুরী বাড়ির দুর্গোৎসব</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={inputStyle} placeholder="your@email.com" />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} style={inputStyle} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} style={btnStyle}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#7a5c4f', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#C0392B', fontWeight: '600' }}>Register</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '8px' }}>
          <Link to="/" style={{ color: '#7a5c4f', fontSize: '0.85rem' }}>← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Registered successfully! 🙏');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#fff', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', padding: '40px', border: '1px solid #f0e0d0' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src={logo} alt="Logo" style={{ height: '70px', width: '70px', objectFit: 'contain' }} />
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#C0392B', fontSize: '1.8rem', marginTop: '12px' }}>Create Account</h2>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[['Name', 'name', 'text', 'Your full name'], ['Email', 'email', 'email', 'your@email.com'], ['Password', 'password', 'password', '••••••••'], ['Confirm Password', 'confirm', 'password', '••••••••']].map(([label, field, type, ph]) => (
            <div key={field}>
              <label style={labelStyle}>{label}</label>
              <input type={type} required value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} style={inputStyle} placeholder={ph} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={btnStyle}>{loading ? 'Creating...' : 'Register'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#7a5c4f', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#C0392B', fontWeight: '600' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontWeight: '600', color: '#3d2b1f', marginBottom: '6px', fontSize: '0.88rem' };
const inputStyle = { width: '100%', padding: '12px 14px', border: '2px solid #e8d5c4', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };
const btnStyle = { padding: '14px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' };
