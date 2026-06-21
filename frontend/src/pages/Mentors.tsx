import React, { useEffect, useState } from 'react';
import { WebLayout } from '../layouts/WebLayout';
import { getSupervisorStudents, getSupervisorStudentDetails, submitStudentGrades } from '../services/supervisorServices';
import { getMonitoredStudents, getMonitoredStudentDetails } from '../services/teacherServices';
import { Users, Calendar, ClipboardList, Award } from 'lucide-react';

export const Mentors: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  // Grade Form State
  const [scoreWork, setScoreWork] = useState(80);
  const [scoreBehavior, setScoreBehavior] = useState(80);
  const [scoreTechnical, setScoreTechnical] = useState(80);
  const [gradeNotes, setGradeNotes] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');

  const userName = localStorage.getItem('userName') || 'Monitor';

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
    fetchStudents(userRole);
  }, []);

  const fetchStudents = async (userRole: string | null) => {
    try {
      let data = [];
      if (userRole === 'pembimbing') {
        data = await getSupervisorStudents();
      } else {
        data = await getMonitoredStudents();
      }
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = async (studentId: number) => {
    setSelectedStudent(studentId);
    setLoadingDetails(true);
    setFormMessage('');
    setFormError('');
    try {
      let data;
      if (role === 'pembimbing') {
        data = await getSupervisorStudentDetails(studentId);
      } else {
        data = await getMonitoredStudentDetails(studentId);
      }
      setStudentDetails(data);
      // Pre-fill grades if they exist
      if (data.grades) {
        setScoreWork(data.grades.scoreWorkAspect || 80);
        setScoreBehavior(data.grades.scoreBehaviorAspect || 80);
        setScoreTechnical(data.grades.scoreTechnicalAspect || 80);
        setGradeNotes(data.grades.notes || '');
      } else {
        setScoreWork(80);
        setScoreBehavior(80);
        setScoreTechnical(80);
        setGradeNotes('');
      }
    } catch (error) {
      console.error('Error loading student details', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage('');
    setFormError('');
    if (!selectedStudent) return;
    try {
      await submitStudentGrades({
        studentId: selectedStudent,
        scoreWorkAspect: scoreWork,
        scoreBehaviorAspect: scoreBehavior,
        scoreTechnicalAspect: scoreTechnical,
        notes: gradeNotes
      });
      setFormMessage('Nilai siswa berhasil disimpan!');
      // Re-fetch details
      const data = await getSupervisorStudentDetails(selectedStudent);
      setStudentDetails(data);
      // Refresh students list
      fetchStudents(role);
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Gagal menyimpan nilai.');
    }
  };

  return (
    <WebLayout title="SISWA BIMBINGAN" userName={userName}>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px' }}>
        {/* Left Side: Students List */}
        <div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '15px', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} />
              <span>Daftar Siswa</span>
            </h3>

            {loading ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Memuat...</p>
            ) : students.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {students.map((stud) => {
                  const isSelected = selectedStudent === stud.id;
                  const score = stud.grades?.[0]?.averageScore || stud.grades?.averageScore;
                  return (
                    <div
                      key={stud.id}
                      onClick={() => handleSelectStudent(stud.id)}
                      style={{
                        padding: '12px 15px',
                        borderRadius: '12px',
                        background: isSelected ? 'var(--primary-light)' : 'rgba(255,255,255,0.4)',
                        border: isSelected ? '1px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.6)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                          {stud.user?.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Kelas: {stud.class?.name || 'Umum'} | NIS: {stud.nis}
                        </div>
                      </div>
                      {score ? (
                        <span style={{ fontSize: '0.8rem', background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '8px', fontWeight: 700 }}>
                          {score}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.7rem', background: '#fef3c7', color: '#b45309', padding: '3px 6px', borderRadius: '8px', fontWeight: 600 }}>
                          Belum Dinilai
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tidak ada siswa yang terdaftar.</p>
            )}
          </div>
        </div>

        {/* Right Side: Student Details / Grading Sheet */}
        <div>
          {loadingDetails ? (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
              <h4 style={{ color: 'var(--primary-color)' }}>Memuat detail siswa...</h4>
            </div>
          ) : studentDetails ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Profile Card details */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '10px' }}>
                  {studentDetails.student?.user?.name || studentDetails.student?.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Email: {studentDetails.student?.user?.email} | NIS: {studentDetails.student?.nis} | No. Telp: {studentDetails.student?.phone}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Alamat: {studentDetails.student?.address}
                </p>
              </div>

              {/* Assessment Panel (Grading Form) */}
              {role === 'pembimbing' && (
                <div className="glass-panel" style={{ padding: '25px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={18} className="text-primary" />
                    <span>Laporan Penilaian Kinerja Magang</span>
                  </h3>

                  {formMessage && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '15px', fontWeight: 600 }}>
                      {formMessage}
                    </div>
                  )}

                  {formError && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '15px', fontWeight: 600 }}>
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleGradeSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Aspek Kedisiplinan & Kehadiran (10-100)</label>
                        <input
                          type="number"
                          min="10"
                          max="100"
                          className="form-input"
                          style={{ fontSize: '0.85rem', padding: '10px 14px' }}
                          value={scoreWork}
                          onChange={(e) => setScoreWork(parseInt(e.target.value) || 0)}
                          required
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Aspek Perilaku, Etika & Sikap (10-100)</label>
                        <input
                          type="number"
                          min="10"
                          max="100"
                          className="form-input"
                          style={{ fontSize: '0.85rem', padding: '10px 14px' }}
                          value={scoreBehavior}
                          onChange={(e) => setScoreBehavior(parseInt(e.target.value) || 0)}
                          required
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Aspek Teknis, Kualitas Kerja & Kemampuan (10-100)</label>
                        <input
                          type="number"
                          min="10"
                          max="100"
                          className="form-input"
                          style={{ fontSize: '0.85rem', padding: '10px 14px' }}
                          value={scoreTechnical}
                          onChange={(e) => setScoreTechnical(parseInt(e.target.value) || 0)}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '15px' }}>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Catatan / Evaluasi Untuk Siswa</label>
                        <textarea
                          className="form-input"
                          style={{ flex: 1, fontSize: '0.85rem', padding: '12px', resize: 'none', minHeight: '100px' }}
                          placeholder="Masukkan catatan kemajuan atau bidang peningkatan..."
                          value={gradeNotes}
                          onChange={(e) => setGradeNotes(e.target.value)}
                        />
                      </div>

                      <button type="submit" className="btn-primary" style={{ padding: '10px', fontSize: '0.85rem' }}>
                        Simpan Penilaian
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Attendance and Journal History Tabs/Sections */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Attendance Panel */}
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} className="text-primary" />
                    <span>Kehadiran Terkini</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {studentDetails.attendances?.length > 0 ? (
                      studentDetails.attendances.slice(0, 10).map((att: any) => (
                        <div key={att.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                          <span style={{ fontWeight: 600 }}>{att.date}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{att.checkInTime || '--:--'} s/d {att.checkOutTime || '--:--'}</span>
                          <span style={{ color: '#22c55e', fontWeight: 700, textTransform: 'uppercase' }}>{att.status}</span>
                        </div>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Belum ada riwayat absensi.</span>
                    )}
                  </div>
                </div>

                {/* Journals Panel */}
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ClipboardList size={16} className="text-primary" />
                    <span>Laporan Jurnal</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
                    {studentDetails.journals?.length > 0 ? (
                      studentDetails.journals.map((journ: any) => (
                        <div key={journ.id} style={{ padding: '10px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', borderLeft: journ.status === 'verified' ? '3px solid #22c55e' : '3px solid #f59e0b' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            <span>{journ.date}</span>
                            <span style={{ fontWeight: 700, color: journ.status === 'verified' ? '#22c55e' : '#f59e0b' }}>
                              {journ.status.toUpperCase()}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)' }}>{journ.activityDetails}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Progress: {journ.progressPercentage}%
                          </div>
                        </div>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Belum ada log jurnal harian.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '15px' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Pilih Siswa</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Silakan pilih salah satu siswa dari daftar di samping untuk melihat riwayat aktivitas dan menginput nilai magang.</p>
            </div>
          )}
        </div>
      </div>
    </WebLayout>
  );
};
