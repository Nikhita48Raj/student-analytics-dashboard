import React from 'react';
import MetricsGrid from './MetricsGrid';
import InsightsSection from './InsightsSection';

const DashboardView = ({ analytics, activityList }) => {
  return (
    <div className="dashboard-view animate__animated animate__fadeIn">
      <div className="dashboard-header-inner" style={{ marginBottom: '2rem' }}>
        <h2 className="futuristic-title" style={{ fontSize: '2rem' }}>Dashboard Overview</h2>
        <p style={{ color: 'var(--text-secondary)' }}>High-level insights and recent system activity.</p>
      </div>

      <MetricsGrid metrics={analytics} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ gridColumn: 'span 2' }}>
            <InsightsSection metrics={analytics} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
