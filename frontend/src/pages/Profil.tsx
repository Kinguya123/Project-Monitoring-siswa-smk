import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '../layouts/MobileLayout';
import { getStudentMentorInfo, getStudentGrades } from '../services/studentServices';
import { User, LogOut, Building2, Award, FileSpreadsheet } from 'lucide-react';

export const Profil: React.FC = () => {
  const [mentorInfo, setMentorInfo] = useState<any>(null);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'Agus Nur';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await getStudentMentorInfo();
        const scoreData = await getStudentGrades();
        setMentorInfo(info);
        setGrades(scoreData || []);
      } catch (err) {
        console.error('Error fetching profile details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3 style={{ color: 'var(--primary-color)' }}>Memuat Profil...</h3>
      </div>
    );
  }

  return (
    <MobileLayout title="PROFIL">
      {/* Student Profile Identity Card */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0', padding: '25px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.2)' }}>
          <User size={40} />
        </div>
        <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '4px', color: 'var(--text-dark)' }}>{userName}</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Siswa Magang (RPL A)</p>
        <span style={{ fontSize: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '4px 10px', borderRadius: '12px', marginTop: '10px', fontWeight: 700 }}>
          NIS: 25635711
        </span>
      </div>

      {/* Company & Mentor Information */}
      <div className="glass-panel" style={{ padding: '18px', marginBottom: '20px' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '15px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={16} />
          <span>Informasi Penempatan PKL</span>
        </h4>

        {mentorInfo && mentorInfo.company ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8rem' }}>
            <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Nama Perusahaan</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{mentorInfo.company.name}</div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Bidang Usaha</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{mentorInfo.company.sector}</div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Alamat Kantor</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{mentorInfo.company.address}</div>
            </div>

            {mentorInfo.supervisors && mentorInfo.supervisors.length > 0 ? (
              <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Pembimbing Industri</div>
                <div style={{ color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <User size={12} />
                  <span>{mentorInfo.supervisors[0].user?.name} ({mentorInfo.supervisors[0].phone || 'No Telp'})</span>
                </div>
              </div>
            ) : (
              <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Pembimbing Industri</div>
                <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{mentorInfo.company.mentorName} (Belum Taut Akun)</div>
              </div>
            )}

            {mentorInfo.schoolTeacher && (
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Guru Pembimbing Sekolah</div>
                <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{mentorInfo.schoolTeacher.user?.name}</div>
              </div>
            )}
          </div>
        ) : (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Belum aktif di tempat PKL mana pun.
          </p>
        )}
      </div>

      {/* Grades/Score Report Card */}
      <div className="glass-panel" style={{ padding: '18px', marginBottom: '20px' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '15px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={16} />
          <span>Laporan Nilai PKL</span>
        </h4>

        {grades.length > 0 ? (
          grades.map((grade) => (
            <div key={grade.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: '10px', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Aspek Kerja / Kedisiplinan</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-color)', textAlign: 'right' }}>{grade.scoreWorkAspect}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: '10px', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Aspek Perilaku / Sikap</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-color)', textAlign: 'right' }}>{grade.scoreBehaviorAspect}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: '10px', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Aspek Teknis / Kemampuan</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-color)', textAlign: 'right' }}>{grade.scoreTechnicalAspect}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: '10px', alignItems: 'center', background: 'var(--primary-light)', padding: '10px', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-color)' }}>Rata - Rata Nilai</span>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary-color)', textAlign: 'right' }}>{grade.averageScore}</span>
              </div>

              {grade.notes && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '5px 0' }}>
                  &ldquo;{grade.notes}&rdquo;
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <FileSpreadsheet size={24} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Nilai PKL belum dimasukkan oleh pembimbing lapangan.
            </p>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="btn-secondary" 
        style={{ width: '100%', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
      >
        <LogOut size={16} />
        <span>Keluar dari Aplikasi</span>
      </button>
    </MobileLayout>
  );
};
