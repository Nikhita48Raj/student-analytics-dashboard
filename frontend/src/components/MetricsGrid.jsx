import React from 'react';

const MetricsGrid = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <section className="metrics-section">
      <div className="metrics-grid futuristic-grid">
        <div className="metric-card futuristic-card" data-tooltip="Total number of student records">
          <div className="card-glow"></div>
          <div className="metric-icon holographic">👥</div>
          <div className="metric-content">
            <h3 className="metric-label">Total Students</h3>
            <p className="metric-value neon-text">{metrics.totalStudents} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>active</span></p>
          </div>
        </div>
        
        <div className="metric-card futuristic-card" data-tooltip="Average score across all students">
          <div className="card-glow"></div>
          <div className="metric-icon holographic">📈</div>
          <div className="metric-content">
            <h3 className="metric-label">Average Score</h3>
            <p className="metric-value neon-text">
               {metrics.averageScore}% 
               <span style={{ fontSize: '1.2rem', marginLeft: '5px' }} className={metrics.averageScore >= 60 ? 'forecast-change positive' : 'forecast-change negative'}>{metrics.averageScore >= 60 ? '↑' : '↓'}</span>
            </p>
          </div>
        </div>

        <div className="metric-card futuristic-card" data-tooltip="Percentage of students passing">
          <div className="card-glow"></div>
          <div className="metric-icon holographic">✅</div>
          <div className="metric-content">
            <h3 className="metric-label">Pass Rate</h3>
            <p className="metric-value neon-text">
               {metrics.passRate}%
               <span style={{ fontSize: '1.2rem', marginLeft: '5px' }} className={metrics.passRate >= 60 ? 'forecast-change positive' : 'forecast-change negative'}>{metrics.passRate >= 60 ? '↑' : '↓'}</span>
            </p>
          </div>
        </div>

        <div className="metric-card futuristic-card" data-tooltip="Average attendance percentage">
          <div className="card-glow"></div>
          <div className="metric-icon holographic">📅</div>
          <div className="metric-content">
            <h3 className="metric-label">Avg Attendance</h3>
            <p className="metric-value neon-text">
               {metrics.averageAttendance}%
               <span style={{ fontSize: '1.2rem', marginLeft: '5px' }} className={metrics.averageAttendance >= 75 ? 'forecast-change positive' : 'forecast-change negative'}>{metrics.averageAttendance >= 75 ? '↑' : '↓'}</span>
            </p>
          </div>
        </div>

        <div className="metric-card risk-card futuristic-card" data-tooltip="Students identified as high or medium risk">
          <div className="card-glow danger-glow"></div>
          <div className="metric-icon holographic pulse">⚠️</div>
          <div className="metric-content">
            <h3 className="metric-label">At-Risk Students</h3>
            <p className="metric-value neon-text danger-neon">
               {metrics.atRiskCount}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetricsGrid;
