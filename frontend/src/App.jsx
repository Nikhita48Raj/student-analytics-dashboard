import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'animate.css';
import './styles/futuristic.css';
import './styles/styles.css';
import './styles/themes.css';

// Layout & Navigation
import Sidebar from './components/Sidebar';
import CommandPalette from './components/CommandPalette';

// Views
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import StudentsView from './components/StudentsView';
import AnalyticsView from './components/AnalyticsView';
import ReportsView from './components/ReportsView';
import AdminView from './components/AdminView';
import AuditLogView from './components/AuditLogView';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState(null);

  // Re-establish session if token exists in localStorage (optional, but good UX)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (loggedUser, authToken) => {
    setUser(loggedUser);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(loggedUser));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setActiveView('dashboard');
  };

  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const headers = { Authorization: `Bearer ${token}` };
      const [studentsRes, analyticsRes, activityRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/students`, { headers }),
        axios.get(`${API_BASE_URL}/analytics`, { headers }),
        axios.get(`${API_BASE_URL}/activity`, { headers }).catch(() => ({ data: [] }))
      ]);

      setStudents(studentsRes.data.data || studentsRes.data);
      setAnalytics(analyticsRes.data.analytics || analyticsRes.data);
      setActivity(activityRes.data || []);
      setDataLoaded(true);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      if (err.response && err.response.status === 403) {
        handleLogout();
      } else {
        setError("Unable to connect to the backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchDashboardData();
    }
  }, [user, token]);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchDashboardData();
      setActiveView('dashboard');
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.error || 'File upload failed. Ensure the backend server is running and you have Admin permissions.');
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (!user || !token) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        toggleTheme={toggleTheme} 
        userRole={user.role} 
        onLogout={handleLogout} 
      />
      
      <main className="main-content" style={{ flex: 1, marginLeft: '250px', padding: '2rem', overflowY: 'auto', height: '100vh', width: 'calc(100% - 250px)' }}>
        
        {/* Top bar logic for logout/user display */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Logged in as: <strong style={{ color: 'var(--primary-color)' }}>{user.name} ({user.role})</strong></span>
        </div>

        {error && (
          <div className="error-banner animate__animated animate__shakeX" style={{ background: 'var(--danger-color)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="spider-web"></div>
            <div className="loading-content">
              <div className="loading-spinner futuristic-spinner"></div>
              <p>Processing Intelligence Data...</p>
              <div className="loading-progress futuristic-progress">
                <div className="loading-progress-bar"></div>
              </div>
            </div>
          </div>
        )}

        {students.length === 0 && !loading && !error && activeView !== 'admin' && activeView !== 'audit' && (
           <div style={{ textAlign: 'center', marginTop: '10vh' }}>
             <h2 className="futuristic-title">Welcome to SIS Nexus Intelligence Platform</h2>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Awaiting initial dataset generation.</p>
             {user.role === 'Admin' ? (
                <button onClick={() => setActiveView('admin')} className="futuristic-btn" style={{ padding: '10px 20px', fontSize: '1.2rem', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                   Go to Admin Control
                </button>
             ) : (
                <p style={{ color: 'var(--text-secondary)' }}>Please wait for the System Administrator to initialize the records.</p>
             )}
           </div>
        )}

        {!loading && !error && activeView === 'admin' && (
          <div className="active-view-container animate__animated animate__fadeIn">
            {user.role === 'Admin' ? (
              <AdminView onUpload={handleFileUpload} onRefresh={fetchDashboardData} />
            ) : (
              <div style={{ color: 'var(--danger-color)', textAlign: 'center', padding: '3rem' }}>
                <h2>ACCESS DENIED</h2>
                <p>Only Administrators can manage system configurations and dataset operations.</p>
              </div>
            )}
          </div>
        )}

        {!loading && !error && activeView === 'audit' && (
          <div className="active-view-container animate__animated animate__fadeIn">
             {user.role === 'Admin' ? (
               <AuditLogView token={token} />
             ) : (
               <div style={{ color: 'var(--danger-color)', textAlign: 'center', padding: '3rem' }}>
                  <h2>ACCESS DENIED</h2>
               </div>
             )}
          </div>
        )}

        {dataLoaded && students.length > 0 && !loading && activeView !== 'admin' && activeView !== 'audit' && (
          <div className="active-view-container">
             {activeView === 'dashboard' && <DashboardView analytics={analytics} activityList={activity} students={students} userRole={user.role} />}
             {activeView === 'students' && <StudentsView students={students} onRefresh={fetchDashboardData} token={token} userRole={user.role} />}
             {activeView === 'analytics' && <AnalyticsView students={students} />}
             {activeView === 'reports' && <ReportsView students={students} userRole={user.role} />}
          </div>
        )}
      </main>

      <CommandPalette students={students} onSelectStudent={(s) => {
          setActiveView('students');
      }} />
    </div>
  );
}

export default App;
