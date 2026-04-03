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
import 'animate.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TeacherDashboard = ({ analytics, activityList, students }) => {
  const [drillDownStudent, setDrillDownStudent] = useState(null);

  if (!students || students.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>No students assigned to your class yet.</div>;
  }

  // Teacher widgets
  const avgClassGPA = (students.reduce((sum, s) => sum + parseFloat(s.gpa), 0) / students.length).toFixed(2);
  const avgAttendance = (students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(1);
  const atRiskStudents = students.filter(s => s.riskLevel && s.riskLevel.id !== 'none');

  // Drill down logic
  let labels = [];
  let marksData = [];
  let pastData = [];

  if (!drillDownStudent) {
    labels = students.map(s => s.name);
    marksData = students.map(s => s.marks);
    pastData = students.map(s => s.pastScores.reduce((a,b)=>a+b,0)/s.pastScores.length);
  } else {
    // Show student history + current as drill down
    const selected = students.find(s => s.id === drillDownStudent);
    labels = ['Term 1', 'Term 2', 'Term 3', 'Current Term'];
    marksData = [...selected.pastScores, selected.marks];
  }

  const chartData = {
    labels,
    datasets: drillDownStudent ? [
      {
         label: 'Student Subject Performance',
         data: marksData,
         backgroundColor: 'rgba(0, 240, 255, 0.6)',
      }
    ] : [
      {
        label: 'Current Academic Performance (%)',
        data: marksData,
        backgroundColor: 'rgba(0, 240, 255, 0.6)',
      },
      {
        label: 'Historical Benchmark (%)',
        data: pastData,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, elements) => {
      if (!drillDownStudent && elements && elements.length > 0) {
         const index = elements[0].index;
         const studentId = students[index].id;
         setDrillDownStudent(studentId);
      }
    },
    scales: {
      y: { min: 0, max: 100, ticks: { color: 'var(--text-secondary)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { ticks: { color: 'var(--text-secondary)' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    },
    plugins: {
       legend: { labels: { color: 'white' } }
    }
  };

  return (
    <div className="teacher-dashboard animate__animated animate__fadeIn">
      <div className="dashboard-header-inner" style={{ marginBottom: '2rem' }}>
        <h2 className="futuristic-title" style={{ fontSize: '2rem' }}>Classroom Intelligence</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Monitor learning trajectories and manage student risks.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Class Average GPA</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{avgClassGPA}</p>
        </div>
        <div className="futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Class Attendance</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{avgAttendance}%</p>
        </div>
        <div className="futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', borderLeft: atRiskStudents.length > 0 ? '4px solid var(--danger-color)' : '4px solid var(--accent-green)' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>At-Risk Count</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: atRiskStudents.length > 0 ? 'var(--danger-color)' : 'var(--accent-green)' }}>{atRiskStudents.length}</p>
        </div>
      </div>

      <div className="chart-container futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', marginBottom: '2rem' }}>
          {drillDownStudent ? (
             <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ color: 'var(--primary-color)' }}>{students.find(s=>s.id===drillDownStudent).name} - Trajectory</h3>
                <button onClick={() => setDrillDownStudent(null)} className="futuristic-btn" style={{ padding: '5px 15px', background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', borderRadius: '4px', cursor: 'pointer' }}>
                  ⬅ Back to Class View
                </button>
             </div>
          ) : (
             <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Class Performance Spectrum (Click bar to drill down)</h3>
          )}
          
          <div style={{ height: '300px' }}>
             <Bar data={chartData} options={chartOptions} />
          </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>⚠️ At-Risk Students Panel</h3>
          {atRiskStudents.length > 0 ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {atRiskStudents.map(s => (
                  <div key={s.id} style={{ padding: '1rem', background: 'rgba(255, 68, 68, 0.1)', borderLeft: '4px solid var(--danger-color)', borderRadius: '4px' }}>
                     <strong>{s.name}</strong> - GPA: {s.gpa} | Attendance: {s.attendance}%
                     <ul style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem' }}>
                         {s.insights.map((ins, i) => <li key={i}>{ins}</li>)}
                         {s.trend === 'Declining' && <li>Consistently declining trend detected.</li>}
                     </ul>
                  </div>
                ))}
             </div>
          ) : (
             <p style={{ color: 'var(--text-secondary)' }}>No students currently at risk.</p>
          )}
        </div>

        <div className="futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>🤖 Class Insights & Anomalies</h3>
          {students.filter(s => s.anomaly || s.trend === 'Improving').length > 0 ? (
             <ul style={{ listStyle: 'none', padding: 0 }}>
               {students.filter(s => s.anomaly).map(s => (
                  <li key={s.id} style={{ padding: '1rem', background: 'rgba(255, 255, 0, 0.1)', borderLeft: '4px solid yellow', marginBottom: '0.5rem', borderRadius: '4px' }}>
                     <span style={{color: 'yellow'}}>Anomaly:</span> {s.name} - Exceptionally high attendance but critically low marks. Intervention required.
                  </li>
               ))}
               {students.filter(s => s.trend === 'Improving').map(s => (
                  <li key={s.id} style={{ padding: '1rem', background: 'rgba(0, 255, 0, 0.1)', borderLeft: '4px solid var(--accent-green)', marginBottom: '0.5rem', borderRadius: '4px' }}>
                     <span style={{color: 'var(--accent-green)'}}>Positive:</span> {s.name} is showing excellent improvement (+{s.gpa} GPA).
                  </li>
               ))}
             </ul>
          ) : (
             <p style={{ color: 'var(--text-secondary)' }}>No specific insights or anomalies actively detected.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
