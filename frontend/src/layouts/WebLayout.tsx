import React, { type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardList, 
  BookOpen, 
  HelpCircle, 
  Settings, 
  LogOut, 
  Search, 
  User as UserIcon 
} from 'lucide-react';
interface WebLayoutProps {
  children: ReactNode;
  title?: string;
  userName?: string;
}
export const WebLayout: React.FC<WebLayoutProps> = ({ children, title = 'DASHBOARD', userName = 'Guru Monitor' }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };
  const menuItems = [
    { name: 'DASBOARD', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'MENTORS', path: '/mentors', icon: <Users size={20} /> },
    { name: 'ABSENSI', path: '/attendance-list', icon: <Calendar size={20} /> },
    { name: 'MY ACTIVITY', path: '/activities', icon: <ClipboardList size={20} /> },
    { name: 'JOURNAL', path: '/journals-list', icon: <BookOpen size={20} /> },
    { name: 'SETTINGS', path: '/settings', icon: <Settings size={20} /> },
    { name: 'HELP', path: '/help', icon: <HelpCircle size={20} /> }
  ];
  // Dummy Calendar details matching right sidebar of Image 2
  const today = new Date();
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <aside className="web-sidebar">
        <div>
          <div className="sidebar-logo">
            <div className="mobile-nav-home-diamond" style={{ top: 0, width: 40, height: 40, borderRadius: 8 }}>
              <BookOpen size={20} />
            </div>
            <span>Monitoring App</span>
          </div>
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        {/* Log Out button */}
        <button 
          onClick={handleLogout}
          className="sidebar-link" 
          style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
        >
          <LogOut size={20} />
          <span>LOG OUT</span>
        </button>
      </aside>
      {/* Main Panel */}
      <main className="web-main" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
        {/* Left main content panel */}
        <div>
          {/* Header */}
          <header className="web-header">
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>{title}</h1>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>HELLO!!</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search student or journal..." 
                  className="form-input" 
                  style={{ width: '280px', paddingLeft: '45px', background: 'rgba(255, 255, 255, 0.5)' }} 
                />
              </div>
              <div className="glass-panel" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '12px' }}>
                <UserIcon size={18} className="text-primary" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{userName}</span>
              </div>
            </div>
          </header>
          {/* Children components */}
          <div className="content-body">
            {children}
          </div>
        </div>
        {/* Right calendar & context panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Calendar element */}
          <div className="calendar-card">
            <div className="calendar-header">
              <span>{today.toLocaleString('default', { month: 'long' }).toUpperCase()} {today.getFullYear()}</span>
            </div>
            
            <div className="calendar-days-row">
              {daysOfWeek.map(d => <span key={d}>{d.substring(0, 3)}</span>)}
            </div>
            <div className="calendar-dates-grid">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const isToday = day === today.getDate();
                return (
                  <div 
                    key={day} 
                    className={`calendar-day-cell ${isToday ? 'active' : ''}`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Quick Info Box */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '15px' }}>INFO UTAMA</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ padding: '8px', background: 'rgba(56, 189, 248, 0.15)', borderRadius: '8px', color: 'var(--primary-color)' }}>
                  <Users size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Siswa PKL</div>
                  <div style={{ fontWeight: 700 }}>128 Siswa</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ padding: '8px', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '8px', color: '#22c55e' }}>
                  <Calendar size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Kehadiran Rata-rata</div>
                  <div style={{ fontWeight: 700 }}>94.2%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
