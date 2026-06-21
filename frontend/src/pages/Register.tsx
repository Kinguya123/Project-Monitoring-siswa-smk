import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerSiswa, loginGoogle } from '../services/authServices';
import { User, Mail, KeyRound, Contact, Phone, MapPin, UserPlus, Chrome } from 'lucide-react';
export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nis, setNis] = useState('');
  const [className, setClassName] = useState('RPL A');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // The 5 classes grouped as requested
  const classOptions = [
    'RPL A',
    'RPL B',
    'ELIND',
    'TBSM A',
    'TBSM B',
    'MEKA A',
    'MEKA B',
    'TKR'
  ];
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerSiswa({
        name,
        email,
        password,
        nis,
        className,
        phone,
        address
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleRegister = async (role: 'guru' | 'pembimbing') => {
    setError('');
    setLoading(true);
    try {
      // Simulate Google Authentication payload
      const mockGooglePayload = {
        name: role === 'guru' ? 'Guru Pembimbing (Google)' : 'Mentor Industri (Google)',
        email: role === 'guru' ? 'guru.google@school.com' : 'pembimbing.google@company.com',
        googleId: `google-id-${Date.now()}`,
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
        role,
        additionalInfo: {
          nip: role === 'guru' ? '198809122015041001' : undefined,
          companyName: role === 'pembimbing' ? 'Google Technology Indonesia' : undefined
        }
      };
      await loginGoogle(mockGooglePayload);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Google registration simulation failed.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-wrapper" style={{ minHeight: '110vh' }}>
      <div className="glass-panel auth-card" style={{ maxWidth: '500px', margin: '40px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-color)' }}>Daftar Akun</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>
            Registrasi Baru Aplikasi SIM-PKL
          </p>
        </div>
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 600 }}>
            {error}
          </div>
        )}
        <form onSubmit={handleRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '44px' }}
                  placeholder="Agus Nur"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">NIS (Siswa)</label>
              <div style={{ position: 'relative' }}>
                <Contact size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '44px' }}
                  placeholder="25635711"
                  value={nis}
                  onChange={(e) => setNis(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="form-input" 
                style={{ paddingLeft: '44px' }}
                placeholder="agus@student.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Kelas</label>
              <select 
                className="form-input form-select"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
              >
                {classOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">No. Telepon</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '44px' }}
                  placeholder="0819xxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Alamat Lengkap</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <textarea 
                className="form-input" 
                style={{ paddingLeft: '44px', height: '80px', resize: 'none' }}
                placeholder="Perum Gading Regensi No. B4, Tasikmalaya"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="form-input" 
                style={{ paddingLeft: '44px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            disabled={loading}
          >
            <UserPlus size={18} />
            <span>{loading ? 'Daftar...' : 'Daftar Sebagai Siswa'}</span>
          </button>
        </form>
        <div style={{ margin: '25px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ATAU DAFTAR (GURU/MENTOR)</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={() => handleGoogleRegister('guru')}
            className="btn-google"
            disabled={loading}
          >
            <Chrome size={18} style={{ color: '#ea4335' }} />
            <span>Guru - Register by Google</span>
          </button>
          <button 
            onClick={() => handleGoogleRegister('pembimbing')}
            className="btn-google"
            disabled={loading}
          >
            <Chrome size={18} style={{ color: '#ea4335' }} />
            <span>Pembimbing - Register by Google</span>
          </button>
        </div>
        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Sudah punya akun? </span>
          <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>Masuk di sini</Link>
        </div>
      </div>
    </div>
  );
};