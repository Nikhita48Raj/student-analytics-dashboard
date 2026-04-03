import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import MetricsGrid from './MetricsGrid';
import InsightsSection from './InsightsSection';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = ({ analytics, activityList, students }) => {
  const [drillDownSubject, setDrillDownSubject] = useState(null);

  let labels = [];
  let marksData = [];
  let attendanceData = [];

  if (!drillDownSubject && students) {
    const subjectMap = {};
    students.forEach(s => {
      if (!subjectMap[s.subject]) subjectMap[s.subject] = { marks: 0, attendance: 0, count: 0 };
      subjectMap[s.subject].marks += Number(s.marks);
      subjectMap[s.subject].attendance += Number(s.attendance);
      subjectMap[s.subject].count++;
    });
    
    labels = Object.keys(subjectMap);
    marksData = labels.map(sub => (subjectMap[sub].marks / subjectMap[sub].count).toFixed(1));
    attendanceData = labels.map(sub => (subjectMap[sub].attendance / subjectMap[sub].count).toFixed(1));
  } else if (drillDownSubject && students) {
    const filteredStudents = students.filter(s => s.subject === drillDownSubject).sort((a,b) => b.marks - a.marks);
    const displayStudents = filteredStudents.slice(0, 15);
    labels = displayStudents.map(s => s.name);
    marksData = displayStudents.map(s => s.marks);
    attendanceData = displayStudents.map(s => s.attendance);
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Avg Marks (%)',
        data: marksData,
        backgroundColor: 'rgba(0, 240, 255, 0.6)',
      },
      {
        label: 'Avg Attendance (%)',
        data: attendanceData,
        backgroundColor: 'rgba(255, 0, 128, 0.6)',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, elements) => {
      if (!drillDownSubject && elements && elements.length > 0) {
         const index = elements[0].index;
         const subject = labels[index];
         setDrillDownSubject(subject);
      }
    },
    scales: {
      y: { min: 0, max: 100, ticks: { color: 'var(--text-secondary)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { ticks: { color: 'var(--text-secondary)' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    },
    plugins: {
      legend: { labels: { color: 'white' } },
      title: {
        display: true,
        text: drillDownSubject ? `${drillDownSubject} - Top Students` : 'Institutional Performance Drill-Down (Click to expand)',
        color: 'var(--primary-color)',
        font: { size: 16 }
      }
    }
  };

  const top5Risk = analytics?.top5AtRisk || [];

  return (
    <div className="admin-dashboard animate__animated animate__fadeIn">
      <div className="dashboard-header-inner" style={{ marginBottom: '2rem' }}>
        <h2 className="futuristic-title" style={{ fontSize: '2rem' }}>System Command Overview</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Institution-wide health, advanced analytics and risk monitoring.</p>
      </div>

      <MetricsGrid metrics={analytics} />
      <InsightsSection students={students} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', marginTop: '2rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="chart-container futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', flex: 1, minHeight: '400px' }}>
            {drillDownSubject && (
              <div style={{ marginBottom: '1rem' }}>
                <button onClick={() => setDrillDownSubject(null)} style={{ background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                  ⬅️ Back to All Subjects
                </button>
              </div>
            )}
            <div style={{ height: '350px' }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
             <div className="futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Worst Performing Subjects</h3>
                {analytics?.worstSubjects && analytics.worstSubjects.length > 0 ? (
                   <ul style={{ listStyle: 'none', padding: 0 }}>
                     {analytics.worstSubjects.map((sub, i) => (
                       <li key={i} style={{ padding: '10px', background: 'rgba(255, 68, 68, 0.1)', marginBottom: '5px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                         <span>{sub.subject}</span>
                         <span style={{ color: 'var(--danger-color)' }}>{sub.avg.toFixed(1)}%</span>
                       </li>
                     ))}
                   </ul>
                ) : <p style={{ color: 'var(--text-secondary)' }}>No data</p>}
             </div>
             
             <div className="futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Top Cohort (Best Batch)</h3>
                {analytics?.bestBatch ? (
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                     <div style={{ fontSize: '3rem' }}>🏆</div>
                     <h2 style={{ color: 'var(--primary-color)' }}>Batch {analytics.bestBatch.batch}</h2>
                     <p style={{ color: 'var(--text-secondary)' }}>Avg: {analytics.bestBatch.avg.toFixed(1)}%</p>
                   </div>
                ) : <p style={{ color: 'var(--text-secondary)' }}>No data</p>}
             </div>
          </div>
        </div>

        <div className="futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', borderLeft: '4px solid var(--danger-color)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>⚠️ Top 5 At-Risk Watchlist</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>High-severity individuals flagged for immediate intervention.</p>
          
          {top5Risk.length > 0 ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
               {top5Risk.map(s => (
                  <div key={s.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 68, 68, 0.3)' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <strong style={{ color: 'white' }}>{s.name}</strong>
                        <span style={{ color: 'var(--danger-color)', fontSize: '0.8rem', background: 'rgba(255,68,68,0.2)', padding: '2px 6px', borderRadius: '4px' }}>SEVERITY HIGH</span>
                     </div>
                     <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                       GPA: {s.gpa} • Attendance: {s.attendance}%
                     </div>
                     <div style={{ fontSize: '0.85rem', color: '#ffbaba' }}>
                       <strong>Why flagged:</strong> {s.explain}
                     </div>
                  </div>
               ))}
             </div>
          ) : (
             <p style={{ color: 'var(--text-secondary)' }}>No students currently flagged in the watchlist.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
