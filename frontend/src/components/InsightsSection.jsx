import React, { useMemo } from 'react';

const InsightsSection = ({ students }) => {
  if (!students || students.length === 0) return null;

  const insights = useMemo(() => {
    const list = [];
    const total = students.length;
    
    // Performance Math
    const marksList = students.map(s => Number(s.marks));
    const avgScore = marksList.reduce((a,b) => a+b, 0) / total;
    const attList = students.map(s => Number(s.attendance));
    const avgAtt = attList.reduce((a,b) => a+b, 0) / total;
    
    // Subject Comparisons
    const subMap = {};
    students.forEach(s => {
       if(!subMap[s.subject]) subMap[s.subject] = { marks:0, count:0 };
       subMap[s.subject].marks += Number(s.marks);
       subMap[s.subject].count++;
    });
    
    const subjectAvgs = Object.keys(subMap).map(sub => ({ sub, avg: subMap[sub].marks / subMap[sub].count }));
    subjectAvgs.sort((a,b) => b.avg - a.avg);

    if (subjectAvgs.length > 1) {
       const best = subjectAvgs[0];
       const worst = subjectAvgs[subjectAvgs.length - 1];
       const diff = (best.avg - worst.avg).toFixed(1);
       if (diff > 10) {
         list.push({
           type: 'warning', icon: '📊', title: 'Subject Discrepancy',
           content: `There is a significant performance gap of ${diff}% between ${best.sub} (strongest) and ${worst.sub} (weakest). Targeted resources should be allocated to ${worst.sub}.`
         });
       }
    }

    // Risk Analysis
    const highRisk = students.filter(s => s.riskLevel && s.riskLevel.id === 'high');
    if (highRisk.length > 0) {
       const riskPct = ((highRisk.length / total) * 100).toFixed(1);
       list.push({
         type: 'danger', icon: '🚨', title: 'Severity Warning',
         content: `${riskPct}% of the displayed cohort (${highRisk.length} students) fall into the High Risk category requiring immediate intervention.`
       });
    }

    // Trend Analysis
    const declining = students.filter(s => s.trend === 'Declining');
    if (declining.length > total * 0.2) {
       list.push({
         type: 'warning', icon: '📉', title: 'Negative Momentum',
         content: `Over $'{((declining.length/total)*100).toFixed(0)}'% of students are showing a declining trajectory structurally. A holistic review of recent curriculum changes is recommended.`
       });
    } else if (students.filter(s => s.trend === 'Improving').length > total * 0.4) {
       list.push({
         type: 'success', icon: '🚀', title: 'Positive Trajectory',
         content: `Strong upward momentum detected! A significant portion of the cohort is consistently improving their historical baselines.`
       });
    }

    // Attendance vs Performance Paradox
    const paradox = students.filter(s => Number(s.attendance) > 90 && Number(s.marks) < 50);
    if (paradox.length > 0) {
       list.push({
         type: 'ai', icon: '🧠', title: 'Effort-Yield Paradox',
         content: `Anomaly Detected: ${paradox.length} student(s) exhibit excellent attendance (>90%) but failing grades. This indicates a comprehension barrier rather than a participation issue.`
       });
    }

    if (list.length === 0) {
       list.push({
         type: 'success', icon: '✅', title: 'System Nominal',
         content: `All aggregate metrics are within acceptable institutional parameters for this cohort.`
       });
    }

    return list;
  }, [students]);

  return (
    <section className="insights-section animate__animated animate__fadeInUp" style={{ marginTop: '2rem' }}>
      <div className="section-header-futuristic">
        <h2 className="insights-title futuristic-title">
          <span className="title-glow">💡</span>
          <span>Data Storytelling Engine</span>
          <span className="ai-badge" style={{ marginLeft: '10px' }}>AI ANALYSIS</span>
        </h2>
      </div>
      <div className="ai-insights-container">
        {insights.map((insight, idx) => (
          <div key={idx} className="ai-insight-card" style={{ borderLeft: `4px solid var(--${insight.type}-color, #00ffff)` }}>
            <div className="insight-header" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <span className="insight-icon" style={{ fontSize: '2rem', animation: 'float 3s ease-in-out infinite' }}>{insight.icon}</span>
              <h3 className="insight-title" style={{ margin: 0, color: 'var(--text-primary)', fontFamily: 'Orbitron' }}>{insight.title}</h3>
            </div>
            <p className="insight-content" style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{insight.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InsightsSection;
