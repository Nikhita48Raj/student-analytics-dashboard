import React, { useState } from 'react';

const CompareModal = ({ students, onClose }) => {
  const [student1Id, setStudent1Id] = useState('');
  const [student2Id, setStudent2Id] = useState('');

  const s1 = students.find(s => s.id === student1Id);
  const s2 = students.find(s => s.id === student2Id);

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={onClose}>
      <div className="modal-container large futuristic-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
        <div className="modal-header futuristic-header">
          <h2 className="futuristic-title">Compare Students</h2>
          <button className="modal-close futuristic-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content" style={{ padding: '2rem' }}>
          <div className="compare-selector" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <select className="filter-select" style={{ flex: 1 }} value={student1Id} onChange={e => setStudent1Id(e.target.value)}>
              <option value="">Select First Student</option>
              {students.map(s => <option key={`1-${s.id}`} value={s.id}>{s.name} ({s.id})</option>)}
            </select>
            <span className="vs-badge" style={{ background: 'var(--primary-color)', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold' }}>VS</span>
            <select className="filter-select" style={{ flex: 1 }} value={student2Id} onChange={e => setStudent2Id(e.target.value)}>
              <option value="">Select Second Student</option>
              {students.map(s => <option key={`2-${s.id}`} value={s.id}>{s.name} ({s.id})</option>)}
            </select>
          </div>

          {s1 && s2 && (
            <div className="compare-results" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {/* Student 1 Profile */}
              <div className="metric-card futuristic-card" style={{ padding: '1.5rem', borderTop: `4px solid var(--primary-color)` }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{s1.name}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Score</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{s1.marks}</div>
                    <div style={{ width: '100%', background: 'var(--border-color)', height: '8px', borderRadius: '4px', marginTop: '4px' }}>
                      <div style={{ width: `${s1.marks}%`, background: 'var(--primary-color)', height: '100%', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Attendance</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{s1.attendance}%</div>
                    <div style={{ width: '100%', background: 'var(--border-color)', height: '8px', borderRadius: '4px', marginTop: '4px' }}>
                      <div style={{ width: `${s1.attendance}%`, background: 'var(--primary-color)', height: '100%', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div>
                     <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Subject</div>
                     <div style={{ fontWeight: '600' }}>{s1.subject}</div>
                  </div>
                </div>
              </div>

              {/* Student 2 Profile */}
              <div className="metric-card futuristic-card" style={{ padding: '1.5rem', borderTop: `4px solid var(--secondary-color)` }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{s2.name}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Score</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{s2.marks}</div>
                    <div style={{ width: '100%', background: 'var(--border-color)', height: '8px', borderRadius: '4px', marginTop: '4px' }}>
                      <div style={{ width: `${s2.marks}%`, background: 'var(--secondary-color)', height: '100%', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Attendance</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{s2.attendance}%</div>
                    <div style={{ width: '100%', background: 'var(--border-color)', height: '8px', borderRadius: '4px', marginTop: '4px' }}>
                      <div style={{ width: `${s2.attendance}%`, background: 'var(--secondary-color)', height: '100%', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div>
                     <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Subject</div>
                     <div style={{ fontWeight: '600' }}>{s2.subject}</div>
                  </div>
                </div>
              </div>
              
              {/* Verdict */}
              <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '10px' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Verdict: </strong>
                {Number(s1.marks) > Number(s2.marks) ? `${s1.name} is performing better academically by ${Math.abs(s1.marks - s2.marks)}%.` :
                 Number(s1.marks) < Number(s2.marks) ? `${s2.name} is performing better academically by ${Math.abs(s2.marks - s1.marks)}%.` :
                 'Both students have identical academic performance.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
