import React from 'react';
import UploadSection from './UploadSection';

const AdminView = ({ onUpload }) => {
  return (
    <div className="admin-view animate__animated animate__fadeIn">
      <div className="dashboard-header-inner" style={{ marginBottom: '2rem' }}>
        <h2 className="futuristic-title" style={{ fontSize: '2rem' }}>System Administration</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage datasets, upload new files, and perform bulk operations.</p>
      </div>

      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 300px', gap: '2rem' }}>
        <div className="upload-container">
          <UploadSection onUpload={onUpload} />
          <div className="warning-card futuristic-card" style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderLeft: '4px solid var(--warning-color)' }}>
             <h3>⚠️ Data Overwrite Notice</h3>
             <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Uploading a new CSV dataset will completely overwrite the existing in-memory database records. Ensure you have exported necessary reports prior to upload.</p>
          </div>
        </div>
        
        <div className="system-status futuristic-card" style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '12px' }}>
          <h3>System Health</h3>
          <ul style={{ listStyle: 'none', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <li style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ color: 'var(--text-secondary)' }}>API Status:</span>
               <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>Online</span>
             </li>
             <li style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ color: 'var(--text-secondary)' }}>Database:</span>
               <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Connected</span>
             </li>
             <li style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ color: 'var(--text-secondary)' }}>Latency:</span>
               <span style={{ color: 'var(--text-primary)' }}>12ms</span>
             </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
