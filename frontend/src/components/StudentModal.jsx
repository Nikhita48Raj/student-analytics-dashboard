import React from 'react';

const StudentModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={onClose}>
      <div className="modal-container futuristic-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%' }}>
        <div className="modal-header futuristic-header">
          <h2 className="futuristic-title">Student Details: {student.name}</h2>
          <button className="modal-close futuristic-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content" style={{ padding: '1.5rem', color: 'var(--text-primary)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="metric-card futuristic-card" style={{ padding: '1rem' }}>
              <small style={{ color: 'var(--text-secondary)' }}>Student ID</small>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{student.id}</div>
            </div>
            <div className="metric-card futuristic-card" style={{ padding: '1rem' }}>
              <small style={{ color: 'var(--text-secondary)' }}>Subject</small>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{student.subject}</div>
            </div>
            <div className="metric-card futuristic-card" style={{ padding: '1rem' }}>
              <small style={{ color: 'var(--text-secondary)' }}>Score</small>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{student.marks}%</div>
            </div>
            <div className="metric-card futuristic-card" style={{ padding: '1rem' }}>
              <small style={{ color: 'var(--text-secondary)' }}>Attendance</small>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>{student.attendance}%</div>
            </div>
            <div className="metric-card futuristic-card" style={{ padding: '1rem', gridColumn: 'span 2' }}>
              <small style={{ color: 'var(--text-secondary)' }}>Semester & Assessment</small>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Semester {student.semester} - {student.assessmentType || 'Standard'}</div>
            </div>
          </div>
          
          <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '10px' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>AI Performance Note</h3>
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>
              {Number(student.marks) >= 80 ? 'Exceptional academic engagement. Maintains high quality results.' : 
               Number(student.marks) >= 50 ? 'Steady performance. Displays adequate grasp of subject matter.' : 
               'Intervention recommended. Academic performance is currently below passing threshold.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
