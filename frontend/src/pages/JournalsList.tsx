import React, { useEffect, useState } from 'react';
import { WebLayout } from '../layouts/WebLayout';
import { getInternshipApplications, updateApplicationStatus } from '../services/teacherServices';
import { getSupervisorStudents, getSupervisorStudentDetails, verifyStudentJournal } from '../services/supervisorServices';
import { BookOpen, CheckCircle, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const JournalsList: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Teacher states
  const [applications, setApplications] = useState<any[]>([]);
  const [reviewNotes, setReviewNotes] = useState('');
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);

  // Supervisor states
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [journals, setJournals] = useState<any[]>([]);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [selectedJournalId, setSelectedJournalId] = useState<number | null>(null);

  const userName = localStorage.getItem('userName') || 'Monitor';

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
    fetchData(userRole);
  }, []);

  const fetchData = async (userRole: string | null) => {
    setLoading(true);
    try {
      if (userRole === 'guru') {
        const apps = await getInternshipApplications();
        setApplications(apps || []);
      } else if (userRole === 'pembimbing') {
        const studs = await getSupervisorStudents();
        setStudents(studs || []);
      }
    } catch (err) {
      console.error('Error fetching verification data', err);
    } finally {
      setLoading(false);
    }
  };

  // --- TEACHER ACTIONS ---
  const handleAppStatusChange = async (appId: number, status: 'approved' | 'rejected') => {
    setMessage('');
    setError('');
    try {
      await updateApplicationStatus(appId, { status, reviewNotes });
      setMessage(`Berhasil memperbarui pengajuan menjadi ${status}!`);
      setReviewNotes('');
      setSelectedAppId(null);
      // Refresh applications
      const apps = await getInternshipApplications();
      setApplications(apps || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui status pengajuan.');
    }
  };

  // --- SUPERVISOR ACTIONS ---
  const handleSelectStudent = async (studentId: number) => {
    setSelectedStudent(studentId);
    setSelectedJournalId(null);
    setVerificationNotes('');
    try {
      const details = await getSupervisorStudentDetails(studentId);
      setJournals(details.journals || []);
    } catch (err) {
      console.error('Error fetching student journals', err);
    }
  };

  const handleVerifyJournal = async (journalId: number) => {
    setMessage('');
    setError('');
    try {
      await verifyStudentJournal(journalId, { status: 'verified', notes: verificationNotes });
      setMessage('Jurnal harian siswa berhasil diverifikasi!');
      setVerificationNotes('');
      setSelectedJournalId(null);
      // Refresh journals
      if (selectedStudent) {
        handleSelectStudent(selectedStudent);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memverifikasi jurnal.');
    }
  };

  return (
    <WebLayout title={role === 'guru' ? 'PERSETUJUAN PKL' : 'VERIFIKASI JURNAL'} userName={userName}>
      {message && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 600 }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--primary-color)' }}>Memuat Data...</h4>
        </div>
      ) : role === 'guru' ? (
        /* --- 1. TEACHER VIEW: Review PKL Placement Applications --- */
        <div className="glass-panel" style={{ padding: '25px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>
            Daftar Pengajuan Tempat PKL Siswa
          </h3>

          {applications.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {applications.map((app) => (
                <div key={app.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', background: 'rgba(255,255,255,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                        {app.student?.user?.name || 'Siswa'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '10px' }}>
                        Kelas: {app.student?.class?.name || 'Umum'} | NIS: {app.student?.nis}
                      </span>
                    </div>

                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '10px',
                      background: app.status === 'approved' ? 'rgba(34,197,94,0.1)' : app.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                      color: app.status === 'approved' ? '#22c55e' : app.status === 'rejected' ? '#ef4444' : '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {app.status === 'approved' ? <CheckCircle2 size={12} /> : app.status === 'rejected' ? <XCircle size={12} /> : <AlertCircle size={12} />}
                      <span>{app.status.toUpperCase()}</span>
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '5px', marginBottom: '12px' }}>
                    <strong>Rencana Lokasi:</strong> {app.company?.name} ({app.company?.sector}) <br />
                    <strong>Alamat Perusahaan:</strong> {app.company?.address} <br />
                    <strong>Rencana Pembimbing:</strong> {app.company?.mentorName}
                  </div>

                  {app.status === 'pending' && (
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px', marginTop: '10px' }}>
                      {selectedAppId === app.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <textarea
                            className="form-input"
                            style={{ fontSize: '0.8rem', height: '60px', resize: 'none' }}
                            placeholder="Tulis alasan persetujuan atau penolakan (opsional)..."
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                          />
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={() => handleAppStatusChange(app.id, 'approved')}
                              className="btn-primary"
                              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                            >
                              Setujui Pengajuan
                            </button>
                            <button
                              onClick={() => handleAppStatusChange(app.id, 'rejected')}
                              className="btn-secondary"
                              style={{ padding: '8px 16px', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                            >
                              Tolak Pengajuan
                            </button>
                            <button
                              onClick={() => setSelectedAppId(null)}
                              className="btn-secondary"
                              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setSelectedAppId(app.id); setReviewNotes(''); }}
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                        >
                          Tinjau Pengajuan
                        </button>
                      )}
                    </div>
                  )}

                  {app.reviewNotes && (
                    <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(0,0,0,0.02)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', borderLeft: '2px solid rgba(0,0,0,0.1)' }}>
                      <strong>Catatan Peninjau:</strong> {app.reviewNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Tidak ada pengajuan tempat magang saat ini.
            </p>
          )}
        </div>
      ) : (
        /* --- 2. SUPERVISOR VIEW: Verify Student Daily Journals --- */
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
          {/* Student list selector */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '15px' }}>Siswa Bimbingan</h3>
            {students.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {students.map((s) => {
                  const isSelected = selectedStudent === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectStudent(s.id)}
                      style={{
                        padding: '12px 15px',
                        borderRadius: '12px',
                        background: isSelected ? 'var(--primary-light)' : 'rgba(255,255,255,0.4)',
                        border: isSelected ? '1px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.6)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)' }}>{s.user?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NIS: {s.nis} | Kelas: {s.class?.name}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tidak ada siswa magang di perusahaan Anda.</p>
            )}
          </div>

          {/* Journals Timeline list */}
          <div className="glass-panel" style={{ padding: '25px' }}>
            {selectedStudent ? (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>
                  Riwayat Jurnal Harian Siswa
                </h3>

                {journals.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {journals.map((j) => (
                      <div key={j.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', background: 'rgba(255,255,255,0.3)', borderLeft: j.status === 'verified' ? '4px solid #22c55e' : '4px solid #f59e0b' }}>
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
                            <span>{j.status.toUpperCase()}</span>
                          </span>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)', marginBottom: '8px', lineHeight: '1.4' }}>
                          {j.activityDetails}
                        </p>

                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Progress Pekerjaan: <strong>{j.progressPercentage}%</strong>
                        </div>

                        {j.status === 'pending' && (
                          <div style={{ marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                            {selectedJournalId === j.id ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <input
                                  type="text"
                                  className="form-input"
                                  style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                                  placeholder="Tulis catatan atau saran untuk siswa (opsional)..."
                                  value={verificationNotes}
                                  onChange={(e) => setVerificationNotes(e.target.value)}
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                  <button
                                    onClick={() => handleVerifyJournal(j.id)}
                                    className="btn-primary"
                                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                  >
                                    Setujui / Verifikasi
                                  </button>
                                  <button
                                    onClick={() => setSelectedJournalId(null)}
                                    className="btn-secondary"
                                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                  >
                                    Batal
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setSelectedJournalId(j.id); setVerificationNotes(''); }}
                                className="btn-primary"
                                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                              >
                                Verifikasi Jurnal
                              </button>
                            )}
                          </div>
                        )}

                        {j.notes && (
                          <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(0,0,0,0.02)', borderRadius: '6px', fontSize: '0.7rem', color: 'var(--text-muted)', borderLeft: '2px solid rgba(0,0,0,0.1)' }}>
                            <strong>Catatan Pembimbing:</strong> {j.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Siswa belum mengunggah jurnal magang.
                  </p>
                )}
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '15px' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Pilih Siswa Bimbingan</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Silakan pilih salah satu siswa di samping untuk meninjau dan memverifikasi laporan jurnal harian magang mereka.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </WebLayout>
  );
};
