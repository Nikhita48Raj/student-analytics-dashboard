import React from 'react';

const Sidebar = ({ activeView, setActiveView, toggleTheme }) => {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'students', icon: '👥', label: 'Students' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'reports', icon: '📄', label: 'Reports' },
    { id: 'admin', icon: '⚙️', label: 'Admin' }
  ];

  return (
    <aside className="sidebar futuristic-sidebar" style={{
      width: '250px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: 'var(--bg-primary)',
      borderRight: '1px solid var(--border-color)',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      boxShadow: 'var(--shadow-md)'
    }}>
      <div className="sidebar-header" style={{ marginBottom: '3rem', padding: '0 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
          <span>🎓</span>
          <span>SIS Nexus</span>
        </h1>
      </div>

      <nav className="sidebar-nav" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              width: '100%',
              background: activeView === item.id ? 'var(--primary-color)' : 'transparent',
              color: activeView === item.id ? 'white' : 'var(--text-primary)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              fontWeight: activeView === item.id ? 'bold' : 'normal'
            }}
            onMouseEnter={e => { if (activeView !== item.id) e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
            onMouseLeave={e => { if (activeView !== item.id) e.currentTarget.style.background = 'transparent'; }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
        <button 
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            width: '100%',
            background: 'transparent',
            color: 'var(--text-primary)',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            cursor: 'pointer'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span className="theme-icon">🌓</span>
          <span>Toggle Theme</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
