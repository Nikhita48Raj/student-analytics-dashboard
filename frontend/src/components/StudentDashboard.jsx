import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
} from 'chart.js';
import { Line, Radar, Doughnut } from 'react-chartjs-2';
import 'animate.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
);

const StudentDashboard = ({ analytics, activityList, students }) => {
  // If no data, wait for it
  if (!students || students.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading Student Intelligence Data...</div>;
  }

  // A student user only has one active record logically, or multiple if they have history. 
  // We assume students array has one main object representing current state, or we aggregate.
  const myData = students[0];

  const gpa = myData.gpa;
  const attendance = myData.attendance;
  const trend = myData.trend;

  // Timeline (Past Scores + Current)
  const timelineLabels = ['Term 1', 'Term 2', 'Term 3', 'Current Term'];
  const timelineData = [...myData.pastScores, myData.marks];

  const lineChartData = {
    labels: timelineLabels,
    datasets: [
      {
        label: 'Performance Trajectory (%)',
        data: timelineData,
        borderColor: 'rgba(0, 240, 255, 1)',
        backgroundColor: 'rgba(0, 240, 255, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: 'var(--text-primary)' } },
    },
    scales: {
      y: { min: 0, max: 100, ticks: { color: 'var(--text-secondary)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { ticks: { color: 'var(--text-secondary)' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  // Strengths vs Weaknesses (Mocked based on simple past vs current variation to make a radar)
  // Normally this would come from multiple subjects. If students[] returns all subjects for this student:
  const isMultiSubject = students.length > 1;
  const radarLabels = isMultiSubject ? students.map(s => s.subject) : ['Math', 'Science', 'English', 'History', 'Art'];
  const radarData = isMultiSubject ? students.map(s => s.marks) : [myData.marks, (myData.marks + 10)%100, (myData.marks - 10)%100, (myData.marks + 5)%100, 80];

  const strengthChartData = {
    labels: radarLabels,
    datasets: [
      {
        label: 'Subject Competency',
        data: radarData,
        backgroundColor: 'rgba(255, 0, 128, 0.4)',
        borderColor: 'rgba(255, 0, 128, 1)',
        pointBackgroundColor: 'rgba(255, 0, 128, 1)',
      }
    ]
  };

  const strengthChartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: 'var(--text-primary)' } }
    },
    scales: {
      r: {
         angleLines: { color: 'rgba(255,255,255,0.1)' },
         grid: { color: 'rgba(255,255,255,0.1)' },
         pointLabels: { color: 'var(--text-primary)', font: { size: 14 } },
         ticks: { backdropColor: 'transparent', color: 'var(--text-secondary)' }
      }
    }
  };

  // derived insights
  const recommendations = [];
  const alerts = [];
  
  if (attendance < 75) {
    alerts.push('Low attendance is severely impacting your learning curve.');
    recommendations.push('Increase your attendance immediately to improve your GPA.');
  }

  if (trend === 'Declining') {
    alerts.push('Sudden performance drop detected across recent assessments.');
    recommendations.push('Focus more on your core subjects and consider asking teachers for extra help.');
  }

  if (trend === 'Improving') {
    recommendations.push("You are improving well. Keep up the consistent effort!");
  }

  if (myData.marks > 85) {
    recommendations.push("Stellar performance! You might want to consider advanced placement or honours modules.");
  }

  if (myData.remarks) {
     recommendations.push(`Teacher Note: ${myData.remarks}`);
  }

  return (
    <div className="student-dashboard animate__animated animate__fadeIn">
      <div className="dashboard-header-inner" style={{ marginBottom: '2rem' }}>
        <h2 className="futuristic-title" style={{ fontSize: '2rem' }}>Student Neural Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Your personal analytics and self-improvement tracking.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', width: '100%', textAlign: 'left' }}>Current GPA</h3>
          <div style={{ position: 'relative', width: '150px', height: '150px' }}>
             <Doughnut 
                data={{
                  labels: ['Achieved', 'Remaining'],
                  datasets: [{
                     data: [Number(gpa), 10 - Number(gpa)], // Assuming 10 pt scale
                     backgroundColor: ['rgba(0, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.1)'],
                     borderWidth: 0
                  }]
                }} 
                options={{ cutout: '80%', plugins: { tooltip: { enabled: false }, legend: { display: false } }, responsive: true, maintainAspectRatio: false }} 
             />
             <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00ffff', textShadow: '0 0 10px #00ffff' }}>{gpa}</span>
             </div>
          </div>
        </div>
        <div className="futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Attendance Rate</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: attendance >= 75 ? 'var(--accent-green)' : 'var(--danger-color)' }}>{attendance}%</p>
        </div>
        <div className="futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Performance Trend</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: trend === 'Improving' ? 'var(--accent-green)' : trend === 'Declining' ? 'var(--danger-color)' : 'var(--text-primary)' }}>
            {trend} {trend === 'Improving' ? '↑' : trend === 'Declining' ? '↓' : '→'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
           <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Performance Timeline</h3>
           <div style={{ height: '300px' }}>
             <Line data={lineChartData} options={lineChartOptions} />
           </div>
        </div>

        <div className="futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
           <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Strengths vs Weaknesses</h3>
           <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
             <Radar data={strengthChartData} options={strengthChartOptions} />
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', borderLeft: '4px solid var(--accent-green)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--accent-green)' }}>🧠 AI Recommendations</h3>
          {recommendations.length > 0 ? (
             <ul style={{ listStyle: 'none', padding: 0 }}>
               {recommendations.map((rec, i) => (
                 <li key={i} style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem', borderRadius: '4px' }}>✨ {rec}</li>
               ))}
             </ul>
          ) : (
             <p style={{ color: 'var(--text-secondary)' }}>No active recommendations.</p>
          )}
        </div>

        <div className="futuristic-card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', borderLeft: '4px solid var(--danger-color)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--danger-color)' }}>⚠️ Critical Alerts</h3>
          {alerts.length > 0 ? (
             <ul style={{ listStyle: 'none', padding: 0 }}>
               {alerts.map((al, i) => (
                 <li key={i} style={{ padding: '0.8rem', background: 'rgba(255,68,68,0.1)', color: 'var(--danger-color)', marginBottom: '0.5rem', borderRadius: '4px' }}>🚨 {al}</li>
               ))}
             </ul>
          ) : (
             <p style={{ color: 'var(--text-secondary)' }}>All systems normal. No risk detected.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
