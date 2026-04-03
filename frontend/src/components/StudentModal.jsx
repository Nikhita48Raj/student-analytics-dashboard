import React from 'react';

const StudentModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={onClose}>
      <div className="modal-container futuristic-modal animate__animated animate__zoomIn" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header futuristic-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="futuristic-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {student.anomaly && <span title="Anomaly Detected" style={{ color: 'var(--danger-color)', fontSize: '1.5rem' }}>⚠️</span>}
            Student Profile: {student.name}
          </h2>
          <button className="modal-close futuristic-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-content" style={{ padding: '1.5rem', color: 'var(--text-primary)' }}>
          {student.anomaly && (
            <div className="anomaly-banner" style={{ background: 'rgba(255, 68, 68, 0.1)', border: '1px solid var(--danger-color)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>🚨</span>
              <div>
                <strong>Critical Anomaly Detected</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>This record has been flagged automatically by the intelligence engine due to unusual performance deviation.</p>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="metric-card futuristic-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <small style={{ color: 'var(--text-secondary)' }}>CGPA</small>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{student.gpa || '--'}</div>
            </div>
            <div className="metric-card futuristic-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <small style={{ color: 'var(--text-secondary)' }}>Consistency</small>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{student.consistencyScore || '--'}</div>
            </div>
            <div className="metric-card futuristic-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <small style={{ color: 'var(--text-secondary)' }}>Score</small>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{student.marks}%</div>
            </div>
            <div className="metric-card futuristic-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <small style={{ color: 'var(--text-secondary)' }}>Attendance</small>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>{student.attendance}%</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="info-box" style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Demographics & Info</h4>
              <p><strong>ID:</strong> {student.id}</p>
              <p><strong>Subject:</strong> {student.subject}</p>
              <p><strong>Semester:</strong> {student.semester}</p>
            </div>
            <div className="info-box" style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Trend Classification</h4>
              <div style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                {student.trend === 'Improving' && <><span style={{ color: '#00ff88' }}>↗️</span> <strong style={{ color: '#00ff88' }}>Improving Trend</strong></>}
                {student.trend === 'Declining' && <><span style={{ color: '#ff4444' }}>↘️</span> <strong style={{ color: '#ff4444' }}>Declining Trend</strong></>}
                {student.trend === 'Stable' && <><span style={{ color: '#aaaaaa' }}>➡️</span> <strong style={{ color: '#aaaaaa' }}>Stable Path</strong></>}
                {!student.trend && <span>--</span>}
              </div>
              {student.riskLevel && student.riskLevel.id !== 'none' && (
                <div style={{ marginTop: '1rem' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    background: student.riskLevel.id === 'high' ? 'rgba(255,68,68,0.2)' : student.riskLevel.id === 'medium' ? 'rgba(255,165,0,0.2)' : 'rgba(255,255,0,0.2)',
                    color: student.riskLevel.id === 'high' ? 'var(--danger-color)' : student.riskLevel.id === 'medium' ? 'orange' : 'yellow'
                  }}>
                    {student.riskLevel.level}
                  </span>
                </div>
              )}
            </div>
          </div>

          {student.remarks && (
            <div style={{ padding: '1.2rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.5rem', borderLeft: '4px solid var(--secondary-color)' }}>
              <h4 style={{ color: 'var(--secondary-color)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📝 Teacher Remarks</h4>
              <p style={{ color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '1.6', margin: 0 }}>{student.remarks}</p>
            </div>
          )}

          <div className="explainable-insights" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '10px', borderLeft: '4px solid var(--primary-color)' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🧠 Explainable Analytics Insights</h3>
            {student.insights && student.insights.length > 0 ? (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: 0 }}>
                {student.insights.map((insight, idx) => (
                  <li key={idx} style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '5px', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {insight}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                System has not generated specific anomaly or intervention insights for this record. Operations normal.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
