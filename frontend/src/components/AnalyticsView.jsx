import React, { useState, useMemo } from 'react';
import ChartsSection from './ChartsSection';

const AnalyticsView = ({ students }) => {
  const [compareMode, setCompareMode] = useState(false);
  const [subjectA, setSubjectA] = useState('');
  const [subjectB, setSubjectB] = useState('');

  const subjects = useMemo(() => Array.from(new Set(students.map(s => s.subject))), [students]);

  // Default selections
  if (subjects.length >= 2 && !subjectA && !subjectB) {
     setSubjectA(subjects[0]);
     setSubjectB(subjects[1]);
  }

  const cohortA = useMemo(() => students.filter(s => s.subject === subjectA), [students, subjectA]);
  const cohortB = useMemo(() => students.filter(s => s.subject === subjectB), [students, subjectB]);

  return (
    <div className="analytics-view animate__animated animate__fadeIn">
      <div className="dashboard-header-inner" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <h2 className="futuristic-title" style={{ fontSize: '2rem' }}>Advanced Analytics</h2>
           <p style={{ color: 'var(--text-secondary)' }}>Deep dive into comprehensive visualizations and trends.</p>
        </div>
        <div>
           <button 
             onClick={() => setCompareMode(!compareMode)}
             className="futuristic-btn"
             style={{
               background: compareMode ? 'var(--danger-color)' : 'var(--primary-color)',
               color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold'
             }}
           >
             {compareMode ? 'Disable Comparison' : '⚖️ Compare Cohorts'}
           </button>
        </div>
      </div>

      {!compareMode ? (
        <ChartsSection students={students} />
      ) : (
        <div className="compare-mode-container animate__animated animate__zoomIn" style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--primary-color)' }}>Cohort Comparison Engine</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
            
            {/* Cohort A */}
            <div className="cohort-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <select 
                 className="futuristic-input"
                 value={subjectA} 
                 onChange={e => setSubjectA(e.target.value)}
                 style={{ padding: '0.8rem', background: 'var(--bg-secondary)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '1.1rem' }}
               >
                 {subjects.map(s => <option key={`A-${s}`} value={s}>{s}</option>)}
               </select>
               <ChartsSection students={cohortA} hideTitle />
            </div>

            {/* Cohort B */}
            <div className="cohort-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <select 
                 className="futuristic-input"
                 value={subjectB} 
                 onChange={e => setSubjectB(e.target.value)}
                 style={{ padding: '0.8rem', background: 'var(--bg-secondary)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '1.1rem' }}
               >
                 {subjects.map(s => <option key={`B-${s}`} value={s}>{s}</option>)}
               </select>
               <ChartsSection students={cohortB} hideTitle />
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsView;
