import React, { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const ChartsSection = ({ students, hideTitle = false }) => {
  const [filterSubject, setFilterSubject] = useState(null);

  const activeStudents = useMemo(() => {
     return filterSubject ? students.filter(s => s.subject === filterSubject) : students;
  }, [students, filterSubject]);

  const scoreData = useMemo(() => {
    const ranges = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 };
    activeStudents.forEach(s => {
      const score = Number(s.marks) || 0;
      if (score <= 20) ranges['0-20']++;
      else if (score <= 40) ranges['21-40']++;
      else if (score <= 60) ranges['41-60']++;
      else if (score <= 80) ranges['61-80']++;
      else ranges['81-100']++;
    });

    return {
      labels: Object.keys(ranges),
      datasets: [
        {
          label: 'Number of Students',
          data: Object.values(ranges),
          backgroundColor: 'rgba(79, 70, 229, 0.7)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [activeStudents]);

  const attendanceData = useMemo(() => {
    const ranges = { '0-50%': 0, '51-70%': 0, '71-85%': 0, '86-100%': 0 };
    activeStudents.forEach(s => {
      const att = Number(s.attendance) || 0;
      if (att <= 50) ranges['0-50%']++;
      else if (att <= 70) ranges['51-70%']++;
      else if (att <= 85) ranges['71-85%']++;
      else ranges['86-100%']++;
    });

    return {
      labels: Object.keys(ranges),
      datasets: [
        {
          data: Object.values(ranges),
          backgroundColor: [
            'rgba(239, 68, 68, 0.7)',  // Red
            'rgba(245, 158, 11, 0.7)', // Orange
            'rgba(59, 130, 246, 0.7)', // Blue
            'rgba(16, 185, 129, 0.7)', // Green
          ],
          borderColor: [
            'rgba(239, 68, 68, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [activeStudents]);

  const subjectData = useMemo(() => {
    const subjects = {};
    students.forEach(s => {
      if (!subjects[s.subject]) subjects[s.subject] = { total: 0, count: 0 };
      subjects[s.subject].total += Number(s.marks) || 0;
      subjects[s.subject].count++;
    });

    const labels = Object.keys(subjects);
    const data = labels.map(l => (subjects[l].total / subjects[l].count).toFixed(1));

    return {
      labels,
      datasets: [
        {
          label: 'Average Score',
          data,
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
        }
      ]
    };
  }, [students]);

  const riskData = useMemo(() => {
    const counts = { 'High Risk': 0, 'Medium Risk': 0, 'Low Risk': 0, 'No Risk': 0 };
    activeStudents.forEach(student => {
      const marks = Number(student.marks) || 0;
      const attendance = Number(student.attendance) || 0;
      let riskScore = 0;
      if (marks < 40) riskScore += 0.4;
      else if (marks < 50) riskScore += 0.2;
      if (attendance < 60) riskScore += 0.3;
      
      if (riskScore >= 0.7) counts['High Risk']++;
      else if (riskScore >= 0.4) counts['Medium Risk']++;
      else if (riskScore >= 0.2) counts['Low Risk']++;
      else counts['No Risk']++;
    });

    return {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)', // High
          'rgba(245, 158, 11, 0.7)', // Medium
          'rgba(59, 130, 246, 0.7)', // Low
          'rgba(16, 185, 129, 0.7)'  // None
        ]
      }]
    };
  }, [activeStudents]);

  const trendData = useMemo(() => {
    const semesters = {};
    activeStudents.forEach(s => {
      const sem = s.semester || '1';
      if (!semesters[sem]) semesters[sem] = { total: 0, count: 0 };
      semesters[sem].total += Number(s.marks) || 0;
      semesters[sem].count++;
    });

    // Sort semester keys natural
    const labels = Object.keys(semesters).sort((a,b) => a.localeCompare(b, undefined, {numeric: true}));
    const data = labels.map(l => (semesters[l].total / semesters[l].count).toFixed(1));

    return {
      labels: labels.map(l => `Semester ${l}`),
      datasets: [
        {
          label: 'Class Average Trend',
          data,
          borderColor: 'rgba(245, 158, 11, 1)',
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(245, 158, 11, 1)',
          pointRadius: 5
        }
      ]
    };
  }, [activeStudents]);

  // Generate generic Heatmap Matrix logic
  const heatmapData = useMemo(() => {
    const subjects = Array.from(new Set(students.map(s => s.subject)));
    const sems = Array.from(new Set(students.map(s => s.semester))).sort((a,b) => a.localeCompare(b, undefined, {numeric: true}));
    
    const matrix = subjects.map(sub => {
       return sems.map(sem => {
          const matching = students.filter(s => s.subject === sub && s.semester === sem);
          if (matching.length === 0) return null;
          const avg = matching.reduce((sum, s) => sum + (Number(s.marks)||0), 0) / matching.length;
          return Math.round(avg);
       });
    });

    return { subjects, periods: sems, matrix };
  }, [students]);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { position: 'top', labels: { color: '#a0aec0' } },
      tooltip: {
         backgroundColor: 'rgba(15, 23, 42, 0.9)',
         titleColor: '#00ffff',
         bodyFont: { size: 14 },
         padding: 12,
         borderColor: 'rgba(0, 255, 255, 0.2)',
         borderWidth: 1
      }
    },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#a0aec0' } },
      x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#a0aec0' } }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
       legend: { position: 'right', labels: { color: '#a0aec0' } },
       tooltip: {
         backgroundColor: 'rgba(15, 23, 42, 0.9)',
         titleColor: '#00ffff',
         padding: 12,
         borderColor: 'rgba(0, 255, 255, 0.2)',
         borderWidth: 1,
         callbacks: {
           label: function(context) { return ` ${context.label}: ${context.raw} Students`; }
         }
       }
    }
  };

  const subjectOptions = {
     ...commonOptions,
     onClick: (event, elements) => {
       if (elements && elements.length > 0) {
         const index = elements[0].index;
         const sub = subjectData.labels[index];
         setFilterSubject(filterSubject === sub ? null : sub);
       }
     },
     plugins: {
        ...commonOptions.plugins,
        tooltip: {
           ...commonOptions.plugins.tooltip,
           callbacks: {
              footer: () => 'Click to filter dashboard by this subject'
           }
        }
     }
  };

  return (
    <section className="charts-section animate__animated animate__fadeIn">
      {!hideTitle && filterSubject && (
         <div style={{ marginBottom: '1rem', background: 'rgba(0,255,255,0.1)', border: '1px solid #00ffff', padding: '0.8rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#00ffff' }}><strong>Smart Cross-Filtering Active:</strong> Displaying data isolating {filterSubject}.</span>
            <button onClick={() => setFilterSubject(null)} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear Filter</button>
         </div>
      )}
      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Score Distribution</h3>
          <div style={{ height: '300px' }}><Bar data={scoreData} options={commonOptions} /></div>
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Subject Performance</h3>
          <div style={{ height: '300px' }}><Bar data={subjectData} options={subjectOptions} /></div>
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Attendance Overview</h3>
          <div style={{ height: '300px' }}><Doughnut data={attendanceData} options={doughnutOptions} /></div>
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Risk Distribution</h3>
          <div style={{ height: '300px' }}><Doughnut data={riskData} options={doughnutOptions} /></div>
        </div>
      </div>
      <div className="charts-grid" style={{ marginBottom: '2rem' }}>
        <div className="chart-card">
          <h3 className="chart-title">Class Performance Trends</h3>
          <div style={{ height: '300px' }}><Line data={trendData} options={commonOptions} /></div>
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Heatmap: Subject vs Semester</h3>
          <div style={{ overflowX: 'auto', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', height: '300px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
               <thead>
                 <tr>
                   <th style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Subject \ Sem</th>
                   {heatmapData.periods.map(p => <th key={p} style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Sem {p}</th>)}
                 </tr>
               </thead>
               <tbody>
                 {heatmapData.subjects.map((sub, rIdx) => (
                    <tr key={sub}>
                      <td style={{ padding: '8px', fontWeight: 'bold', borderRight: '1px solid var(--border-color)' }}>{sub}</td>
                      {heatmapData.matrix[rIdx].map((val, cIdx) => {
                         let bg = 'transparent';
                         let color = 'var(--text-primary)';
                         if (val !== null) {
                            if (val >= 80) bg = 'rgba(16, 185, 129, 0.8)'; // Green
                            else if (val >= 60) bg = 'rgba(59, 130, 246, 0.8)'; // Blue
                            else bg = 'rgba(239, 68, 68, 0.8)'; // Red
                            color = 'white';
                         }
                         return (
                            <td key={cIdx} style={{ padding: '8px', background: bg, color, borderBottom: '1px solid var(--border-color)', opacity: val === null ? 0.3 : 1 }}>
                              {val !== null ? `${val}%` : 'N/A'}
                            </td>
                         );
                      })}
                    </tr>
                 ))}
               </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChartsSection;
