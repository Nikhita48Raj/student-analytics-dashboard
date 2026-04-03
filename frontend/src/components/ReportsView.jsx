import React, { useState, useEffect } from 'react';

const ReportsView = ({ students, userRole }) => {
  const [selectedStudent, setSelectedStudent] = useState('');

  // Auto-select for Student role — they only have one record
  useEffect(() => {
    if (userRole === 'Student' && students.length === 1) {
      setSelectedStudent(students[0].id);
    }
  }, [userRole, students]);

  const handlePrint = () => {
    window.print();
  };

  const s = students.find(st => st.id === selectedStudent);

  const getLetterGrade = (marks) => {
    const m = Number(marks);
    if (m >= 90) return { grade: 'A+', color: '#00ff88' };
    if (m >= 80) return { grade: 'A',  color: '#00cc66' };
    if (m >= 70) return { grade: 'B',  color: '#66aaff' };
    if (m >= 60) return { grade: 'C',  color: '#ffaa00' };
    if (m >= 50) return { grade: 'D',  color: '#ff7700' };
    return { grade: 'F', color: '#ff4444' };
  };

  const getPrincipalRemark = (marks) => {
    const m = Number(marks);
    if (m >= 80) return 'An excellent term. Keep up the outstanding work!';
    if (m >= 60) return 'Satisfactory performance, but there is room for improvement in daily studies.';
    return 'Requires immediate parent-teacher consultation regarding academic standing.';
  };

  return (
    <div className="reports-view animate__animated animate__fadeIn">
      <div className="dashboard-header-inner" style={{ marginBottom: '2rem' }}>
        <h2 className="futuristic-title" style={{ fontSize: '2rem' }}>Reports & Export</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Generate printable report cards and export dataset aggregates.</p>
      </div>

      <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        <div className="report-controls futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-primary)' }}>
          <h3>Generate Report Card</h3>

          {userRole === 'Student' ? (
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Your personal academic report is ready to view and print.
            </p>
          ) : (
            <>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '0.5rem' }}>Select a student to generate a printable academic report.</p>
              <select
                className="filter-select"
                style={{ width: '100%', marginBottom: '1rem' }}
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">Select Student...</option>
                {students.map(st => <option key={`rep-${st.id}`} value={st.id}>{st.name} ({st.id})</option>)}
              </select>
            </>
          )}

          <button
            className="futuristic-btn"
            onClick={handlePrint}
            disabled={!s}
            style={{
              width: '100%',
              background: s ? 'var(--primary-color)' : 'var(--bg-tertiary)',
              color: 'white',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              cursor: s ? 'pointer' : 'not-allowed'
            }}
          >
            🖨️ Print Report Card
          </button>

          {s && s.riskLevel && s.riskLevel.id !== 'none' && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,68,68,0.1)', borderLeft: '4px solid var(--danger-color)', borderRadius: '4px' }}>
              <strong style={{ color: 'var(--danger-color)' }}>⚠️ Risk Alert</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                This student is currently classified as <strong>{s.riskLevel.level}</strong>.
              </p>
            </div>
          )}
        </div>

        {s ? (
          <div className="report-preview futuristic-card" style={{ padding: '2rem', background: 'white', color: 'black' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2rem', margin: 0 }}>SIS Nexus Academy</h1>
              <p style={{ color: '#666', margin: 0 }}>Official Academic Report Card</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <strong>Student Name:</strong> {s.name} <br/>
                <strong>Student ID:</strong> {s.id}<br/>
                <strong>Assessment Type:</strong> {s.assessmentType || 'Exam'}
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>Semester:</strong> {s.semester} <br/>
                <strong>Subject:</strong> {s.subject}<br/>
                <strong>Date Issued:</strong> {new Date().toLocaleDateString()}
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Subject</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>Score</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>Attendance</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>GPA</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>Grade</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>Trend</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{s.subject}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{s.marks}%</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{s.attendance}%</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{s.gpa}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center', fontWeight: 'bold', color: getLetterGrade(s.marks).color }}>
                    {getLetterGrade(s.marks).grade}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                    {s.trend === 'Improving' ? '↗️ Improving' : s.trend === 'Declining' ? '↘️ Declining' : '➡️ Stable'}
                  </td>
                </tr>
              </tbody>
            </table>

            {s.pastScores && s.pastScores.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <strong>Historical Performance:</strong>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  {s.pastScores.map((score, i) => (
                    <div key={i} style={{ textAlign: 'center', padding: '0.5rem 1rem', background: '#f5f5f5', borderRadius: '4px', border: '1px solid #ddd' }}>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>Term {i + 1}</div>
                      <div style={{ fontWeight: 'bold' }}>{Math.round(score)}%</div>
                    </div>
                  ))}
                  <div style={{ textAlign: 'center', padding: '0.5rem 1rem', background: '#e8f5e9', borderRadius: '4px', border: '1px solid #a5d6a7' }}>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Current</div>
                    <div style={{ fontWeight: 'bold' }}>{s.marks}%</div>
                  </div>
                </div>
              </div>
            )}

            {s.remarks && (
              <div style={{ padding: '1rem', border: '1px solid #aaa', background: '#fffde7', marginBottom: '1rem', borderRadius: '4px' }}>
                <strong>Teacher Remarks:</strong>
                <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>{s.remarks}</p>
              </div>
            )}

            <div style={{ padding: '1rem', border: '1px solid #ccc', background: '#fafafa' }}>
              <strong>Principal's Remarks:</strong>
              <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>{getPrincipalRemark(s.marks)}</p>
            </div>
          </div>
        ) : (
          <div className="report-preview-placeholder futuristic-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', minHeight: '300px' }}>
            {userRole === 'Student' ? 'Loading your report...' : 'Select a student to preview their generated report card.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsView;
