import React, { type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Calendar,
  FileText,
  Home,
  Send,
  User as UserIcon,
  Bell,
  Grid
} from 'lucide-react';
interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
}
export const MobileLayout: React.FC<MobileLayoutProps> = ({ children, title = 'DASHBOARD' }) => {
  const navigate = useNavigate();
  return (
    <div className="mobile-simulator-container">
      <div className="mobile-frame">
        {/* Notch details */}
        <div className="mobile-notch"></div>
        <div className="mobile-screen">
          {/* Top header status */}
          <header className="mobile-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '6px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <Grid size={18} style={{ color: 'var(--primary-color)' }} />
              </div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h2>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button style={{ border: 'none', background: 'none', position: 'relative', cursor: 'pointer' }}>
                <Bell size={20} style={{ color: 'var(--text-muted)' }} />
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span>
              </button>
              <div 
                onClick={() => navigate('/profile')}
                style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid var(--glass-border)' }}
              >
                <UserIcon size={16} style={{ color: 'var(--primary-color)' }} />
              </div>
            </div>
          </header>
          {/* Main content body */}
          <div className="mobile-content">
            {children}
          </div>
          {/* Mobile Bottom navigation menu */}
          <nav className="mobile-nav-bar">
            <NavLink 
              to="/attendance" 
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <Calendar size={20} />
              <span>Absensi</span>
            </NavLink>
            <NavLink 
              to="/activities" 
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <FileText size={20} />
              <span>Aktivitas</span>
            </NavLink>
            {/* Middle home diamond key */}
            <NavLink 
              to="/dashboard" 
              className="mobile-nav-home-diamond"
            >
              <Home size={22} />
            </NavLink>
            <NavLink 
              to="/applications" 
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <Send size={20} />
              <span>Pengajuan</span>
            </NavLink>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <UserIcon size={20} />
              <span>Profil</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};
