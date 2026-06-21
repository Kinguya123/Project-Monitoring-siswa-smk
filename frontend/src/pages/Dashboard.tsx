import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentDashboard as getStudentStats } from '../services/studentServices';
import { getTeacherDashboard } from '../services/teacherServices'; 
import { getSupervisorDashboard } from '../services/supervisorServices';
import { MobileLayout } from '../layouts/MobileLayout';
import { WebLayout } from '../layouts/WebLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, ClipboardCheck, Award, Briefcase, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
export const Dashboard: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const [teacherData, setTeacherData] = useState<any>(null);
  const [supervisorData, setSupervisorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
    if (!userRole) {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        if (userRole === 'siswa') {
          const data = await getStudentStats();
          setStudentData(data);
        } else if (userRole === 'guru') {
          const data = await getTeacherDashboard();
          setTeacherData(data);
        } else if (userRole === 'pembimbing') {
          const data = await getSupervisorDashboard();
          setSupervisorData(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3 style={{ color: 'var(--primary-color)' }}>Memuat Halaman...</h3>
      </div>
    );
  }
  // --- 1. RENDERING STUDENT MOBILE DASHBOARD (Image 3) ---
  if (role === 'siswa') {
    const name = studentData?.student?.user?.name || 'Agus Nur';
    const companyName = studentData?.student?.company?.name || 'Belum Ada Tempat PKL';
    const attendanceVal = studentData?.stats?.attendanceRate || 30;
    const activityVal = studentData?.stats?.journalProgress || 67;
    const journalVal = studentData?.stats?.verifiedJournals ? Math.round((studentData.stats.verifiedJournals / Math.max(1, studentData.stats.totalJournals)) * 100) : 89;
    return (
      <MobileLayout title="DASHBOARD">
        <div style={{ margin: '15px 0' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Good Morning</span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)' }}>{name}</h1>
        </div>
        {/* Welcome Banner */}
        <div className="glass-panel" style={{ background: 'var(--primary-gradient)', color: 'white', padding: '20px', borderRadius: '20px', marginBottom: '25px', position: 'relative' }}>
          <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>WELCOME!</h3>
          <p style={{ fontSize: '0.8rem', opacity: 0.9, lineHeight: '1.4' }}>
            Selamat datang di aplikasi PKL Monitoring. Silakan lakukan absensi harian dan isi laporan jurnal Anda hari ini.
          </p>
        </div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '15px' }}>Today Selection</h3>
        {/* 4 Cards from Image 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          {/* Attendance Card */}
          <div className="glass-panel" onClick={() => navigate('/attendance')} style={{ cursor: 'pointer', padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Absensi</span>
              <Calendar size={16} className="text-primary" />
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{attendanceVal}%</div>
            <div className="progress-bar-container" style={{ height: '6px' }}>
              <div className="progress-bar-fill" style={{ width: `${attendanceVal}%` }}></div>
            </div>
          </div>
          {/* Activity Card */}
          <div className="glass-panel" onClick={() => navigate('/activities')} style={{ cursor: 'pointer', padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Activity</span>
              <ClipboardCheck size={16} className="text-primary" />
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{activityVal}%</div>
            <div className="progress-bar-container" style={{ height: '6px' }}>
              <div className="progress-bar-fill" style={{ width: `${activityVal}%` }}></div>
            </div>
          </div>
          {/* Journal Card */}
          <div className="glass-panel" onClick={() => navigate('/activities')} style={{ cursor: 'pointer', padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Journal</span>
              <FileText size={16} className="text-primary" />
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{journalVal}%</div>
            <div className="progress-bar-container" style={{ height: '6px' }}>
              <div className="progress-bar-fill" style={{ width: `${journalVal}%` }}></div>
            </div>
          </div>
          {/* Company Card */}
          <div className="glass-panel" onClick={() => navigate('/applications')} style={{ cursor: 'pointer', padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Company</span>
              <Briefcase size={16} className="text-primary" />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{companyName}</div>
            <div className="progress-bar-container" style={{ height: '6px' }}>
              <div className="progress-bar-fill" style={{ width: studentData?.student?.companyId ? '100%' : '0%' }}></div>
            </div>
          </div>
        </div>
        {/* Latest Journal Logs list */}
        <div className="glass-panel" style={{ padding: '15px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>Aktivitas Terkini</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {studentData?.latestJournals?.length > 0 ? (
              studentData.latestJournals.map((journal: any) => (
                <div key={journal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{journal.activityDetails}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{journal.date}</div>
                  </div>
                  {journal.status === 'verified' ? (
                    <CheckCircle2 size={16} style={{ color: '#22c55e' }} />
                  ) : (
                    <AlertCircle size={16} style={{ color: '#f59e0b' }} />
                  )}
                </div>
              ))
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Belum ada log jurnal yang dibuat.</span>
            )}
          </div>
        </div>
      </MobileLayout>
    );
  }
  // --- 2. RENDERING TEACHER / SUPERVISOR DESKTOP DASHBOARD (Image 2) ---
  const userName = localStorage.getItem('userName') || 'Guru Monitor';
  const totalStud = teacherData?.stats?.totalStudents || supervisorData?.stats?.studentCount || 12;
  const pendingApps = teacherData?.stats?.pendingApps || 0;
  const pendingJournals = teacherData?.stats?.pendingJournals || supervisorData?.stats?.pendingJournals || 0;
  // Chart data
  const chartData = [
    { name: 'RPL A', Kehadiran: 92, Journal: 85, Nilai: 88 },
    { name: 'RPL B', Kehadiran: 88, Journal: 78, Nilai: 82 },
    { name: 'TBSM A', Kehadiran: 94, Journal: 90, Nilai: 85 },
    { name: 'MEKA A', Kehadiran: 95, Journal: 92, Nilai: 90 },
    { name: 'ELIND', Kehadiran: 90, Journal: 80, Nilai: 84 },
    { name: 'TKR', Kehadiran: 91, Journal: 82, Nilai: 86 }
  ];
  return (
    <WebLayout title="DASBOARD" userName={userName}>
      {/* Metrics Row matching Image 2 */}
      <div className="metrics-grid">
        <div className="glass-panel metric-card">
          <div className="metric-icon-wrapper">
            <Calendar size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ABSENSI</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>94.2%</div>
            <div className="progress-bar-container" style={{ height: '6px' }}>
              <div className="progress-bar-fill" style={{ width: '94%' }}></div>
            </div>
          </div>
        </div>
        <div className="glass-panel metric-card">
          <div className="metric-icon-wrapper" style={{ color: '#f59e0b', background: '#fef3c7' }}>
            <ClipboardCheck size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVITY</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalStud} Siswa</div>
            <div className="progress-bar-container" style={{ height: '6px' }}>
              <div className="progress-bar-fill" style={{ width: '70%', background: '#f59e0b' }}></div>
            </div>
          </div>
        </div>
        <div className="glass-panel metric-card">
          <div className="metric-icon-wrapper" style={{ color: '#22c55e', background: '#dcfce7' }}>
            <FileText size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>JURNAL MASUK</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{pendingJournals} Pending</div>
            <div className="progress-bar-container" style={{ height: '6px' }}>
              <div className="progress-bar-fill" style={{ width: '40%', background: '#22c55e' }}></div>
            </div>
          </div>
        </div>
        <div className="glass-panel metric-card">
          <div className="metric-icon-wrapper" style={{ color: '#a855f7', background: '#f3e8ff' }}>
            <Award size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>MEET/SUPERVISI</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>4 Kali</div>
            <div className="progress-bar-container" style={{ height: '6px' }}>
              <div className="progress-bar-fill" style={{ width: '40%', background: '#a855f7' }}></div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Chart Section matching Image 2 */}
      <div className="glass-panel" style={{ padding: '25px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Statistik Praktek Kerja Industri</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Grafik rata-rata per kelas jurusan</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ padding: '4px 12px', background: 'white', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #e2e8f0', cursor: 'pointer' }}>Days</span>
            <span style={{ padding: '4px 12px', background: 'var(--primary-color)', color: 'white', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Weeks</span>
            <span style={{ padding: '4px 12px', background: 'white', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #e2e8f0', cursor: 'pointer' }}>Month</span>
          </div>
        </div>
        {/* Recharts Bar Chart */}
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(37,99,235,0.03)' }} />
              <Bar dataKey="Kehadiran" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={25} name="Kehadiran %" />
              <Bar dataKey="Journal" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={25} name="Jurnal Aktif %" />
              <Bar dataKey="Nilai" fill="#93c5fd" radius={[4, 4, 0, 0]} barSize={25} name="Nilai %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Alerts or Action links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '15px' }}>Pengajuan PKL Siswa</h4>
          {role === 'guru' && pendingApps > 0 ? (
            <div style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.15)', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Ada {pendingApps} Pengajuan Baru</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Siswa menunggu persetujuan lokasi PKL</div>
              </div>
              <button onClick={() => navigate('/journals-list')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Tinjau</button>
            </div>
          ) : (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tidak ada pengajuan lokasi yang tertunda.</span>
          )}
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '15px' }}>Laporan Nilai Supervisor</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {role === 'pembimbing' ? 'Masukkan nilai aspek kinerja untuk siswa bimbingan Anda.' : 'Supervisor industri telah memasukkan nilai praktek.'}
            </span>
            {role === 'pembimbing' && (
              <button onClick={() => navigate('/mentors')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', alignSelf: 'flex-start' }}>Input Nilai PKL</button>
            )}
          </div>
        </div>
      </div>
    </WebLayout>
  );
};
