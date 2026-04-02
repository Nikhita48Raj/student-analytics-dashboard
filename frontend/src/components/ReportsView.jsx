import React, { useState } from 'react';
import { getStudentOptionLabel, getStudentRecordKey } from '../utils/studentRecord';

const ReportsView = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const s = students.find((student) => getStudentRecordKey(student) === selectedStudent);

  return (
    <div className="reports-view animate__animated animate__fadeIn">
      <div className="dashboard-header-inner" style={{ marginBottom: '2rem' }}>
        <h2 className="futuristic-title" style={{ fontSize: '2rem' }}>Reports & Export</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Generate printable report cards and export dataset aggregates.</p>
      </div>

      <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        <div className="report-controls futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-primary)' }}>
          <h3>Generate Report Card</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '0.5rem' }}>Select a student to generate a printable academic report.</p>
          <select 
            className="filter-select" 
            style={{ width: '100%', marginBottom: '1rem' }}
            value={selectedStudent} 
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Select Student...</option>
            {students.map((student) => (
              <option key={`rep-${getStudentRecordKey(student)}`} value={getStudentRecordKey(student)}>
                {getStudentOptionLabel(student)}
              </option>
            ))}
          </select>
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
                  <strong>Student ID:</strong> {s.id}
               </div>
               <div style={{ textAlign: 'right' }}>
                  <strong>Semester:</strong> {s.semester} <br/>
                  <strong>Date Issued:</strong> {new Date().toLocaleDateString()}
               </div>
             </div>

             <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
               <thead>
                 <tr style={{ background: '#f0f0f0' }}>
                   <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Subject</th>
                   <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>Score</th>
                   <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>Attendance</th>
                   <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>Grade</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td style={{ padding: '10px', border: '1px solid #ccc' }}>{s.subject}</td>
                   <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{s.marks}%</td>
                   <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{s.attendance}%</td>
                   <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center', fontWeight: 'bold' }}>
                     {Number(s.marks) >= 90 ? 'A' : Number(s.marks) >= 80 ? 'B' : Number(s.marks) >= 70 ? 'C' : Number(s.marks) >= 60 ? 'D' : 'F'}
                   </td>
                 </tr>
               </tbody>
             </table>

             <div style={{ padding: '1rem', border: '1px solid #ccc', background: '#fafafa' }}>
               <strong>Principal's Remarks:</strong>
               <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                  {Number(s.marks) >= 80 ? "An excellent term. Keep up the outstanding work!" : 
                   Number(s.marks) >= 60 ? "Satisfactory performance, but there is room for improvement in daily studies." : 
                   "Requires immediate parent-teacher consultation regarding academic standing."}
               </p>
             </div>
          </div>
        ) : (
          <div className="report-preview-placeholder futuristic-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
             Select a student to preview their generated report card.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsView;
