import React, { useEffect, useState } from 'react';
import { MobileLayout } from '../layouts/MobileLayout';
import { getStudentAttendance, studentCheckIn, studentCheckOut } from '../services/studentServices';
import { User, Navigation, ArrowLeft, ArrowRight, ShieldCheck, Map } from 'lucide-react';
export const Absensi: React.FC = () => {
  const [attendance, setAttendance] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [locInput, setLocInput] = useState('Tasikmalaya');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const userName = localStorage.getItem('userName') || 'Agus Nur';
  useEffect(() => {
    fetchAttendanceData();
  }, []);
  const fetchAttendanceData = async () => {
    try {
      const data = await getStudentAttendance();
      setAttendance(data.todayAttendance);
      setHistory(data.history || []);
    } catch (error) {
      console.error('Error loading attendance status', error);
    } finally {
      setLoading(false);
    }
  };
  const handleCheckIn = async () => {
    setMessage('');
    try {
      const res = await studentCheckIn(locInput);
      setAttendance(res.attendance);
      setMessage('Berhasil Melakukan Check In!');
      fetchAttendanceData();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Check In Gagal.');
    }
  };
  const handleCheckOut = async () => {
    setMessage('');
    try {
      const res = await studentCheckOut(locInput);
      setAttendance(res.attendance);
      setMessage('Berhasil Melakukan Check Out!');
      fetchAttendanceData();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Check Out Gagal.');
    }
  };
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3>Loading Absensi...</h3>
      </div>
    );
  }
  return (
    <MobileLayout title="ABSENSI">
      {/* 1. Profile Info Card (Image 1 style) */}
      <div className="glass-panel" style={{ display: 'flex', gap: '15px', alignItems: 'center', margin: '15px 0', padding: '15px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={28} />
        </div>
        <div>
          <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>Info:</h4>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            <div>nama: <strong style={{ color: 'var(--text-dark)' }}>{userName}</strong></div>
            <div>id: <strong style={{ color: 'var(--text-dark)' }}>25635711</strong></div>
            <div>lokasi: <strong style={{ color: 'var(--text-dark)' }}>{locInput}</strong></div>
          </div>
        </div>
      </div>
      {/* Message overlay info */}
      {message && (
        <div style={{ padding: '10px 15px', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '15px', textAlign: 'center' }}>
          {message}
        </div>
      )}
      {/* 2. Maps/Check-in Graphic (Image 1 center card) */}
      <div className="glass-panel" style={{ padding: '15px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Status Lokasi</span>
          <Navigation size={14} className="text-primary" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '15px', alignItems: 'center' }}>
          {/* Mock Map Icon matching Image 1 layout */}
          <div style={{ height: '70px', background: 'rgba(37,99,235,0.05)', borderRadius: '12px', border: '1px solid rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
            <Map size={32} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Akurasi Lokasi GPS</div>
            <div>GPS Tracking Aktif</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#22c55e', fontWeight: 700 }}>
              <ShieldCheck size={14} />
              <span>Lokasi Valid (PKL Zone)</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '15px' }}>
          <label className="form-label" style={{ fontSize: '0.75rem' }}>Update Lokasi Saat Ini</label>
          <input 
            type="text" 
            className="form-input" 
            style={{ padding: '8px 12px', fontSize: '0.8rem', borderRadius: '10px' }}
            value={locInput}
            onChange={(e) => setLocInput(e.target.value)}
          />
        </div>
      </div>
      {/* 3. Main Event Action Buttons (Image 1 Bottom card) */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '15px', color: 'var(--text-muted)' }}>Main Event (Hadir Harian)</h4>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button 
            onClick={handleCheckIn}
            disabled={attendance && attendance.checkInTime}
            className="btn-primary" 
            style={{ flex: 1, padding: '12px 0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: attendance && attendance.checkInTime ? 0.5 : 1 }}
          >
            <ArrowRight size={16} />
            <span>{attendance?.checkInTime ? `In: ${attendance.checkInTime}` : 'Clock In'}</span>
          </button>
          <button 
            onClick={handleCheckOut}
            disabled={!attendance?.checkInTime || (attendance && attendance.checkOutTime)}
            className="btn-secondary" 
            style={{ flex: 1, padding: '12px 0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: !attendance?.checkInTime || attendance?.checkOutTime ? 0.5 : 1 }}
          >
            <ArrowLeft size={16} />
            <span>{attendance?.checkOutTime ? `Out: ${attendance.checkOutTime}` : 'Clock Out'}</span>
          </button>
        </div>
      </div>
      {/* 4. History Logs list */}
      <div className="glass-panel" style={{ padding: '15px' }}>
        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-muted)' }}>Riwayat 5 Hari Terakhir</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {history.slice(0, 5).map((h) => (
            <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
              <span style={{ fontWeight: 600 }}>{h.date}</span>
              <span style={{ color: 'var(--text-muted)' }}>{h.checkInTime || '--:--'} s/d {h.checkOutTime || '--:--'}</span>
              <span style={{ color: '#22c55e', fontWeight: 700, textTransform: 'uppercase' }}>{h.status}</span>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};
