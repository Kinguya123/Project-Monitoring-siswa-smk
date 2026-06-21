import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, loginGoogle } from '../services/authServices';
import { Mail, KeyRound, LogIn, Chrome } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSimulate = async (role: 'guru' | 'pembimbing') => {
    setError('');
    setLoading(true);
    try {
      // Simulate Google Authentication payload matching register Google logic
      const mockGooglePayload = {
        name: role === 'guru' ? 'Drs. H. Mulyadi, M.Pd.' : 'Eko Prasetyo (PT. Teknologi)',
        email: role === 'guru' ? 'mulyadi@school.com' : 'eko@company.com',
        googleId: `google-id-${Date.now()}`,
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
        role,
        additionalInfo: {
          nip: role === 'guru' ? '197508122003121002' : undefined,
          companyName: role === 'pembimbing' ? 'PT. Teknologi Nusantara' : undefined
        }
      };
      await loginGoogle(mockGooglePayload);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Google login simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ minHeight: '100vh' }}>
      <div className="glass-panel auth-card" style={{ maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-color)' }}>Masuk Akun</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>
            Aplikasi SIM-PKL Monitoring
          </p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
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
            <LogIn size={18} />
            <span>{loading ? 'Masuk...' : 'Masuk'}</span>
          </button>
        </form>

        <div style={{ margin: '25px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ATAU MASUK SEBAGAI</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={() => handleGoogleLoginSimulate('guru')}
            className="btn-google"
            disabled={loading}
          >
            <Chrome size={18} style={{ color: '#ea4335' }} />
            <span>Guru - Login by Google</span>
          </button>
          <button 
            onClick={() => handleGoogleLoginSimulate('pembimbing')}
            className="btn-google"
            disabled={loading}
          >
            <Chrome size={18} style={{ color: '#ea4335' }} />
            <span>Pembimbing - Login by Google</span>
          </button>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Belum punya akun? </span>
          <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>Daftar di sini</Link>
        </div>
      </div>
    </div>
  );
};
