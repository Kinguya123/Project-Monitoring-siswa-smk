import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Absensi } from './pages/Absensi';
import { Aktivitas } from './pages/Aktivitas';
import { Pengajuan } from './pages/Pengajuan';
import { Profil } from './pages/Profil';
import { Mentors } from './pages/Mentors';
import { JournalsList } from './pages/JournalsList';
import { WebLayout } from './layouts/WebLayout';

// Simple Settings & Help wrappers for Desktop layout
const SettingsPage = () => {
  const userName = localStorage.getItem('userName') || 'Monitor';
  return (
    <WebLayout title="PENGATURAN" userName={userName}>
      <div className="glass-panel" style={{ padding: '25px' }}>
        <h3>Pengaturan Aplikasi</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '10px', fontSize: '0.9rem' }}>
          Fitur pengaturan profil dan opsi sistem sedang dalam pengembangan.
        </p>
      </div>
    </WebLayout>
  );
};

const HelpPage = () => {
  const userName = localStorage.getItem('userName') || 'Monitor';
  return (
    <WebLayout title="BANTUAN" userName={userName}>
      <div className="glass-panel" style={{ padding: '25px' }}>
        <h3>Pusat Bantuan & Panduan</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '10px', fontSize: '0.9rem', lineHeight: '1.5' }}>
          Butuh bantuan mengenai penggunaan sistem SIM-PKL? Silakan hubungi admin sekolah di <strong>admin@pkl.com</strong> atau hubungi guru pembimbing Anda masing-masing.
        </p>
      </div>
    </WebLayout>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard Route (Internal dynamic wrapping inside MobileLayout / WebLayout based on role) */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Student Mobile Layout Routes (Internal layout wrapping inside page components) */}
        <Route path="/attendance" element={<Absensi />} />
        <Route path="/activities" element={<Aktivitas />} />
        <Route path="/applications" element={<Pengajuan />} />
        <Route path="/profile" element={<Profil />} />

        {/* Teacher / Supervisor Web Layout Routes */}
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/attendance-list" element={<Mentors />} /> {/* Direct to Mentors panel to review student attendances */}
        <Route path="/journals-list" element={<JournalsList />} />
        
        {/* Settings & Help */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />

        {/* Wildcard redirect to Login/Dashboard depending on session */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;