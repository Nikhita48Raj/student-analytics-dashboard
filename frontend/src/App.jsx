import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'animate.css';
import './styles/futuristic.css';
import './styles/styles.css';
import './styles/themes.css';
import { API_BASE_URL } from './config';

// Layout & Navigation
import Sidebar from './components/Sidebar';
import CommandPalette from './components/CommandPalette';

// Views
import DashboardView from './components/DashboardView';
import StudentsView from './components/StudentsView';
import AnalyticsView from './components/AnalyticsView';
import ReportsView from './components/ReportsView';
import AdminView from './components/AdminView';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [studentsRes, analyticsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/students`),
        axios.get(`${API_BASE_URL}/analytics`)
      ]);

      setStudents(studentsRes.data.data || studentsRes.data);
      setAnalytics(analyticsRes.data.analytics || analyticsRes.data);
      setDataLoaded(true);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Unable to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchDashboardData();
      setActiveView('dashboard');
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('File upload failed. Ensure the backend server is running and the CSV is appropriately formatted.');
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // On mount, check if there's already data loaded on the server
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const hasStudents = students.length > 0;

  return (
    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} toggleTheme={toggleTheme} />
      
      <main className="main-content" style={{ flex: 1, marginLeft: '250px', padding: '2rem', overflowY: 'auto', height: '100vh', width: 'calc(100% - 250px)' }}>
        {error && (
          <div className="error-banner" style={{ background: 'var(--danger-color)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="spider-web"></div>
            <div className="loading-content">
              <div className="loading-spinner futuristic-spinner"></div>
              <p>Processing Analytics Data...</p>
              <div className="loading-progress futuristic-progress">
                <div className="loading-progress-bar"></div>
              </div>
            </div>
          </div>
        )}

        {!hasStudents && !loading && !error && activeView !== 'admin' && (
           <div style={{ textAlign: 'center', marginTop: '10vh' }}>
             <h2 className="futuristic-title">Welcome to SIS Nexus</h2>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Please navigate to the Admin panel to upload a dataset.</p>
             <button onClick={() => setActiveView('admin')} className="futuristic-btn" style={{ padding: '10px 20px', fontSize: '1.2rem', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                Go to Admin
             </button>
           </div>
        )}

        {dataLoaded && !loading && (
          <div className="active-view-container">
             {activeView === 'admin' && <AdminView onUpload={handleFileUpload} />}
             {hasStudents && activeView === 'dashboard' && <DashboardView analytics={analytics} />}
             {hasStudents && activeView === 'students' && <StudentsView students={students} onRefresh={fetchDashboardData} />}
             {hasStudents && activeView === 'analytics' && <AnalyticsView students={students} />}
             {hasStudents && activeView === 'reports' && <ReportsView students={students} />}
          </div>
        )}
      </main>

      {/* Global Modals/Overlays */}
      <CommandPalette students={students} onSelectStudent={() => {
          // If a student is selected via command palette, switch to students view and open their modal
          setActiveView('students');
          // Ideally we would pass the selected student down to StudentsView, 
          // but for simplicity they can find it in the table.
      }} />
    </div>
  );
}

export default App;
