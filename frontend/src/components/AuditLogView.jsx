import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuditLogView = ({ token }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('All');
  const [filterUser, setFilterUser] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/audit-logs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(res.data.logs);
      } catch (err) {
        console.error('Failed to fetch audit logs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [token]);

  const filteredLogs = logs.filter(l => {
    const matchAction = filterAction === 'All' ? true : l.action.toLowerCase().includes(filterAction.toLowerCase());
    const matchUser = filterUser === '' ? true : l.user.toLowerCase().includes(filterUser.toLowerCase());
    const matchDate = filterDate === '' ? true : new Date(l.timestamp).toISOString().startsWith(filterDate);
    return matchAction && matchUser && matchDate;
  });

  if (loading) return <div style={{ color: 'white' }}>Loading audit logs...</div>;

  return (
    <div className="audit-view animate__animated animate__fadeIn">
      <div className="dashboard-header-inner" style={{ marginBottom: '2rem' }}>
        <h2 className="futuristic-title" style={{ fontSize: '2rem' }}>Audit Logs</h2>
        <p style={{ color: 'var(--text-secondary)' }}>System event tracking and accountability.</p>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Filter by User" 
          className="futuristic-input"
          value={filterUser} 
          onChange={e => setFilterUser(e.target.value)}
          style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', flex: 1 }}
        />
        <input 
          type="date" 
          className="futuristic-input"
          value={filterDate} 
          onChange={e => setFilterDate(e.target.value)}
          style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', flex: 1 }}
        />
        <select 
          className="futuristic-input"
          value={filterAction} 
          onChange={e => setFilterAction(e.target.value)}
          style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', flex: 1 }}
        >
          <option value="All">All Actions</option>
          <option value="Login">Logins</option>
          <option value="Upload">Uploads</option>
          <option value="Edit">Edits</option>
          <option value="Delete">Deletions</option>
          <option value="Create">Creations</option>
        </select>
      </div>

      <div className="table-container futuristic-card" style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'white' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem' }}>Timestamp</th>
              <th style={{ padding: '1rem' }}>User</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Action</th>
              <th style={{ padding: '1rem' }}>Target</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                <td style={{ padding: '1rem' }}>{log.user}</td>
                <td style={{ padding: '1rem' }}><span className="badge" style={{ background: log.role === 'Admin' ? 'var(--danger-color)' : 'var(--primary-color)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{log.role}</span></td>
                <td style={{ padding: '1rem' }}>{log.action}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{log.target}</td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogView;
