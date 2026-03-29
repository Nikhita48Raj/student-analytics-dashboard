import React from 'react';

const InsightsSection = ({ metrics }) => {
  if (!metrics) return null;

  const getInsights = () => {
    const insights = [];

    // Pass rate insight
    if (metrics.passRate < 60) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Low Pass Rate',
        content: `Only ${metrics.passRate}% of students are passing. Consider reviewing curriculum and support systems.`
      });
    } else if (metrics.passRate > 85) {
      insights.push({
        type: 'success',
        icon: '✅',
        title: 'Excellent Pass Rate',
        content: `${metrics.passRate}% pass rate indicates strong academic performance across the cohort.`
      });
    }

    // Attendance insight
    if (metrics.averageAttendance < 70) {
      insights.push({
        type: 'warning',
        icon: '📅',
        title: 'Attendance Concern',
        content: `Average attendance is ${metrics.averageAttendance}%. Low attendance may impact learning outcomes.`
      });
    }

    // Risk insight
    if (metrics.atRiskCount > 0) {
      const riskPercentage = ((metrics.atRiskCount / metrics.totalStudents) * 100).toFixed(1);
      if (riskPercentage > 20) {
        insights.push({
          type: 'danger',
          icon: '🚨',
          title: 'High Risk Population',
          content: `${riskPercentage}% of students are marked as at-risk. Immediate intervention recommended.`
        });
      }
    } else {
      insights.push({
        type: 'success',
        icon: '🌟',
        title: 'Healthy Cohort',
        content: 'No students are currently marked as high risk.'
      });
    }

    return insights;
  };

  const insights = getInsights();

  if (insights.length === 0) return null;

  return (
    <section className="insights-section animate__animated animate__fadeInUp" style={{ marginTop: '2rem' }}>
      <div className="section-header-futuristic">
        <h2 className="insights-title futuristic-title">
          <span className="title-glow">💡</span>
          <span>AI-Powered Insights</span>
          <span className="ai-badge" style={{ marginLeft: '10px', fontSize: '0.8rem', background: 'var(--primary-color)', padding: '2px 8px', borderRadius: '10px', color: 'white' }}>AI</span>
        </h2>
      </div>
      <div className="insights-grid futuristic-grid">
        {insights.map((insight, idx) => (
          <div key={idx} className={`insight-card futuristic-card ${insight.type}`} style={{ padding: '1.5rem', borderRadius: '1rem', background: 'var(--bg-primary)', boxShadow: 'var(--shadow-md)', borderLeft: `4px solid var(--${insight.type}-color)` }}>
            <div className="insight-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="insight-icon" style={{ fontSize: '1.5rem' }}>{insight.icon}</span>
              <h3 className="insight-title" style={{ margin: 0 }}>{insight.title}</h3>
            </div>
            <p className="insight-content" style={{ color: 'var(--text-secondary)', margin: 0 }}>{insight.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InsightsSection;
