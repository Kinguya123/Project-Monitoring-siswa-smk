import React, { useEffect, useState } from 'react';
import { MobileLayout } from '../layouts/MobileLayout';
import { getStudentApplications, applyInternship } from '../services/studentServices';
import { Briefcase, Send, Building2, User, Phone, MapPin, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const Pengajuan: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [mentorName, setMentorName] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getStudentApplications();
      setApplications(data || []);
    } catch (err: any) {
      console.error('Error fetching applications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await applyInternship({
        companyName,
        sector,
        phone,
        address,
        mentorName
      });
      setMessage('Pengajuan magang berhasil dikirim!');
      setCompanyName('');
      setSector('');
      setPhone('');
      setAddress('');
      setMentorName('');
      fetchApplications();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengirim pengajuan.');
    }
  };

  // Check if student has a pending or approved application
  const hasPendingOrApproved = applications.some(
    (app) => app.status === 'pending' || app.status === 'approved'
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3 style={{ color: 'var(--primary-color)' }}>Memuat Data Pengajuan...</h3>
      </div>
    );
  }

  return (
    <MobileLayout title="PENGAJUAN">
      <div style={{ margin: '15px 0' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)' }}>
          Status Pengajuan Tempat PKL
        </h3>
      </div>

      {message && (
        <div style={{ padding: '12px 15px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, color: '#22c55e', marginBottom: '15px', textAlign: 'center' }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ padding: '12px 15px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, color: '#ef4444', marginBottom: '15px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* Applications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
        {applications.length > 0 ? (
          applications.map((app) => (
            <div key={app.id} className="glass-panel" style={{ padding: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '10px',
                  background: app.status === 'approved' ? 'rgba(34,197,94,0.1)' : app.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                  color: app.status === 'approved' ? '#22c55e' : app.status === 'rejected' ? '#ef4444' : '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {app.status === 'approved' ? <CheckCircle2 size={10} /> : app.status === 'rejected' ? <XCircle size={10} /> : <AlertCircle size={10} />}
                  <span>{app.status.toUpperCase()}</span>
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <Building2 size={16} className="text-primary" />
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{app.company?.name}</span>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '26px' }}>
                <div>Sektor: {app.company?.sector}</div>
                <div>Alamat: {app.company?.address}</div>
                <div>Telepon: {app.company?.phone}</div>
                <div>Pembimbing Lapangan: {app.company?.mentorName}</div>
              </div>

              {app.reviewNotes && (
                <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(0,0,0,0.02)', borderRadius: '6px', fontSize: '0.7rem', color: 'var(--text-muted)', borderLeft: '2px solid rgba(0,0,0,0.1)' }}>
                  <strong>Catatan Peninjau:</strong> {app.reviewNotes}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <Briefcase size={32} style={{ color: 'var(--text-muted)', marginBottom: '10px' }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Belum ada pengajuan PKL yang dibuat.</p>
          </div>
        )}
      </div>

      {/* New Application Form */}
      {!hasPendingOrApproved && (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '15px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '15px', color: 'var(--text-muted)' }}>
            Ajukan Tempat PKL Baru
          </h4>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Nama Perusahaan</label>
            <div style={{ position: 'relative' }}>
              <Building2 size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
                placeholder="PT. Teknologi Nusantara"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Sektor Bidang Usaha</label>
            <input
              type="text"
              className="form-input"
              style={{ fontSize: '0.85rem' }}
              placeholder="Software Development / Otomotif"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>No. Telepon Instansi</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
                placeholder="08123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Alamat Lengkap Perusahaan</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
              <textarea
                className="form-input"
                style={{ paddingLeft: '38px', height: '60px', fontSize: '0.85rem', resize: 'none' }}
                placeholder="Jl. Merdeka No. 100, Tasikmalaya"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Nama Pembimbing Lapangan</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
                placeholder="Eko Prasetyo"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Send size={14} />
            <span>Kirim Pengajuan</span>
          </button>
        </form>
      )}

      {hasPendingOrApproved && (
        <div className="glass-panel" style={{ padding: '15px', background: 'rgba(37,99,235,0.03)', border: '1px solid rgba(37,99,235,0.1)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Anda sudah memiliki pengajuan magang yang aktif atau sedang ditinjau. Pengajuan baru hanya dapat dilakukan jika pengajuan sebelumnya ditolak.
          </p>
        </div>
      )}
    </MobileLayout>
  );
};
