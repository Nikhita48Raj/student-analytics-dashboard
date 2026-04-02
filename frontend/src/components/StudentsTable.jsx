import React, { useState, useMemo } from 'react';
import { getStudentRecordKey } from '../utils/studentRecord';

const StudentsTable = ({ students, onRowClick, onEditClick, onDeleteClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const subjects = useMemo(() => Array.from(new Set(students.map(s => s.subject))), [students]);
  const semesters = useMemo(() => Array.from(new Set(students.map(s => s.semester))), [students]);

  const getRiskLevel = (student) => {
    const marks = Number(student.marks) || 0;
    const attendance = Number(student.attendance) || 0;
    let riskScore = 0;
    if (marks < 40) riskScore += 0.4;
    else if (marks < 50) riskScore += 0.2;
    if (attendance < 60) riskScore += 0.3;
    
    if (riskScore >= 0.7) return { level: 'High Risk', class: 'risk-high', id: 'high' };
    if (riskScore >= 0.4) return { level: 'Medium Risk', class: 'risk-medium', id: 'medium' };
    if (riskScore >= 0.2) return { level: 'Low Risk', class: 'risk-low', id: 'low' };
    return { level: 'No Risk', class: 'risk-none', id: 'none' };
  };

  const filteredStudents = useMemo(() => {
    let result = students.filter(student => 
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       student.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (subjectFilter === '' || student.subject === subjectFilter) &&
      (semesterFilter === '' || student.semester === semesterFilter) &&
      (riskFilter === '' || getRiskLevel(student).id === riskFilter)
    );

    result.sort((a, b) => {
      const [key, dir] = sortOption.split('-');
      const factor = dir === 'asc' ? 1 : -1;
      if (key === 'name') return a.name.localeCompare(b.name) * factor;
      if (key === 'score') return (Number(a.marks) - Number(b.marks)) * factor;
      if (key === 'attendance') return (Number(a.attendance) - Number(b.attendance)) * factor;
      return 0;
    });

    return result;
  }, [students, searchTerm, subjectFilter, semesterFilter, riskFilter, sortOption]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentPageNumber = totalPages === 0 ? 1 : Math.min(currentPage, totalPages);
  
  const currentStudents = useMemo(() => {
    const start = (currentPageNumber - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPageNumber]);

  const calculateTrend = (marks) => {
    if (marks >= 80) return 'up';
    if (marks < 40) return 'down';
    return 'stable';
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Subject', 'Score', 'Attendance', 'Semester', 'Risk Level'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(s => [
        s.id, s.name, s.subject, s.marks, s.attendance, s.semester, getRiskLevel(s).level
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_export.csv';
    a.click();
  };

  return (
    <section className="table-section animate__animated animate__fadeInUp" style={{ marginTop: '2rem' }}>
      <div className="table-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div className="table-header-left">
          <h2 className="futuristic-title">Student Data</h2>
          <div className="table-stats">
            <span className="stat-badge" style={{ background: 'var(--primary-color)', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>{filteredStudents.length}</span> students displayed
          </div>
        </div>
        <div className="table-actions controls-grid" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input 
            type="text" placeholder="Search..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="search-box" style={{ padding: '8px', borderRadius: '5px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
          />
          <select value={subjectFilter} onChange={(e) => { setSubjectFilter(e.target.value); setCurrentPage(1); }} className="filter-select">
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={semesterFilter} onChange={(e) => { setSemesterFilter(e.target.value); setCurrentPage(1); }} className="filter-select">
            <option value="">All Semesters</option>
            {semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <select value={riskFilter} onChange={(e) => { setRiskFilter(e.target.value); setCurrentPage(1); }} className="filter-select">
            <option value="">All Risks</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
            <option value="none">No Risk</option>
          </select>
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="filter-select">
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="score-desc">Score (High-Low)</option>
            <option value="score-asc">Score (Low-High)</option>
            <option value="attendance-desc">Attendance (High-Low)</option>
            <option value="attendance-asc">Attendance (Low-High)</option>
          </select>
          <button onClick={exportCSV} className="export-btn" style={{ padding: '8px 16px', background: 'var(--secondary-color)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Export CSV
          </button>
        </div>
      </div>
      
      <div className="table-container futuristic-table-container">
        <div className="table-wrapper">
          <table className="students-table futuristic-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Subject</th>
                <th>Score</th>
                <th>Attendance</th>
                <th>Semester</th>
                <th>Risk Level</th>
                <th>Trend</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, idx) => {
                const risk = getRiskLevel(student);
                const trend = calculateTrend(student.marks);
                return (
                  <tr key={getStudentRecordKey(student) || `${student.id}-${idx}`} onClick={() => onRowClick && onRowClick(student)} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.subject}</td>
                    <td>{student.marks}</td>
                    <td>{student.attendance}%</td>
                    <td>{student.semester}</td>
                    <td>
                      <span className={`risk-badge ${risk.class}`}>{risk.level}</span>
                    </td>
                    <td>
                      <span className={`trend-icon ${trend}`}>{trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️'}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                         onClick={(e) => { e.stopPropagation(); onEditClick && onEditClick(student); }}
                         style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', marginRight: '0.5rem' }}
                         title="Edit Record"
                      >✏️</button>
                      <button 
                         onClick={(e) => { e.stopPropagation(); onDeleteClick && onDeleteClick(student); }}
                         style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                         title="Delete Record"
                      >🗑️</button>
                    </td>
                  </tr>
                );
              })}
              {currentStudents.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="table-pagination" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPageNumber - 1))}
              disabled={currentPageNumber === 1}
              className="pagination-btn"
            >
              ← Previous
            </button>
            <span className="pagination-info" style={{ color: 'var(--text-primary)' }}>
              Page <span>{currentPageNumber}</span> of <span>{totalPages}</span>
            </span>
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPageNumber + 1))}
              disabled={currentPageNumber === totalPages}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudentsTable;
