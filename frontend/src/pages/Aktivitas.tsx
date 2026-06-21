import React, { useEffect, useState } from 'react';
import { MobileLayout } from '../layouts/MobileLayout';
import { getStudentJournals, addStudentJournal } from '../services/studentServices';
import { ClipboardList, PlusCircle, CheckCircle, Clock } from 'lucide-react';
export const Aktivitas: React.FC = () => {
  const [journals, setJournals] = useState<any[]>([]);
  const [activityDetails, setActivityDetails] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(50);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    fetchJournals();
  }, []);
  const fetchJournals = async () => {
    try {
      const data = await getStudentJournals();
      setJournals(data || []);
    } catch (error) {
      console.error('Error fetching journals', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      await addStudentJournal({
        activityDetails,
        progressPercentage,
        imageUrl
      });
      setMessage('Jurnal berhasil disimpan!');
      setActivityDetails('');
      setProgressPercentage(50);
      setImageUrl('');
      setShowForm(false);
      fetchJournals();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Gagal menyimpan jurnal.');
    }
  };
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3>Loading Jurnal...</h3>
      </div>
    );
  }
  return (
    <MobileLayout title="AKTIVITAS">
      {/* Button to toggle journal input form */}
      <div style={{ margin: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)' }}>Laporan Jurnal PKL</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary" 
          style={{ padding: '8px 14px', fontSize: '0.75rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <PlusCircle size={14} />
          <span>{showForm ? 'Batal' : 'Isi Jurnal'}</span>
        </button>
      </div>
      {message && (
        <div style={{ padding: '10px 15px', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '15px', textAlign: 'center' }}>
          {message}
        </div>
      )}
      {/* Journal Input Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '15px', marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Detail Aktivitas Harian</label>
            <textarea 
              className="form-input"
              style={{ height: '80px', fontSize: '0.85rem', resize: 'none' }}
              placeholder="Tulis pekerjaan atau materi PKL hari ini secara detail..."
              value={activityDetails}
              onChange={(e) => setActivityDetails(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Progress Pekerjaan</span>
              <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{progressPercentage}%</span>
            </label>
            <input 
              type="range" 
              min="10" 
              max="100" 
              step="5"
              style={{ width: '100%', accentColor: 'var(--primary-color)' }}
              value={progressPercentage}
              onChange={(e) => setProgressPercentage(parseInt(e.target.value))}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Link Gambar Bukti Kegiatan (Opsional)</label>
            <input 
              type="text" 
              className="form-input"
              style={{ fontSize: '0.85rem', padding: '10px' }}
              placeholder="https://image-bukti.com/img.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.8rem' }}>
            Kirim Laporan Jurnal
          </button>
        </form>
      )}
      {/* Journals Timeline List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {journals.length > 0 ? (
          journals.map((j) => (
            <div key={j.id} className="glass-panel" style={{ padding: '15px', borderLeft: j.status === 'verified' ? '4px solid #22c55e' : '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{j.date}</span>
                <span style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 700, 
                  padding: '3px 8px', 
                  borderRadius: '10px', 
                  background: j.status === 'verified' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                  color: j.status === 'verified' ? '#22c55e' : '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {j.status === 'verified' ? <CheckCircle size={10} /> : <Clock size={10} />}
                  <span>{j.status}</span>
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '10px', color: 'var(--text-dark)' }}>
                {j.activityDetails}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Progress: <strong>{j.progressPercentage}%</strong></span>
              </div>
              {j.notes && (
                <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(0,0,0,0.02)', borderRadius: '6px', fontSize: '0.7rem', color: 'var(--text-muted)', borderLeft: '2px solid rgba(0,0,0,0.1)' }}>
                  <strong>Catatan Pembimbing:</strong> {j.notes}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <ClipboardList size={32} style={{ color: 'var(--text-muted)', marginBottom: '10px' }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Belum ada aktivitas journal yang dilaporkan.</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};
