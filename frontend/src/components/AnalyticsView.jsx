import React from 'react';
import ChartsSection from './ChartsSection';

const AnalyticsView = ({ students }) => {
  return (
    <div className="analytics-view animate__animated animate__fadeIn">
      <div className="dashboard-header-inner" style={{ marginBottom: '2rem' }}>
        <h2 className="futuristic-title" style={{ fontSize: '2rem' }}>Advanced Analytics</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Deep dive into comprehensive visualizations and trends.</p>
      </div>

      <ChartsSection students={students} />
    </div>
  );
};

export default AnalyticsView;
