/**
 * DATA VISUALIZATION MODULE
 * Creates interactive charts using Chart.js
 */

class VisualizationEngine {
    constructor() {
        this.charts = {};
    }

    /**
     * Initialize all charts
     * @param {Object} metrics - Analytics metrics object
     * @param {Array} data - Student data array
     */
    initializeCharts(metrics, data) {
        this.destroyAllCharts();
        
        this.createScoreDistributionChart(metrics.scoreDistribution);
        this.createSubjectPerformanceChart(metrics.subjectStats);
        this.createSemesterTrendsChart(metrics.semesterStats);
        this.createAttendanceChart(metrics.attendanceDistribution);
        this.createHeatmapChart(data);
        this.createRiskDistributionChart(data);
    }

    /**
     * Destroy all existing charts
     */
    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
    }

    /**
     * Create score distribution chart
     * @param {Object} distribution - Score distribution data
     */
    createScoreDistributionChart(distribution) {
        const ctx = document.getElementById('scoreChart');
        if (!ctx) return;

        const labels = Object.keys(distribution);
        const data = Object.values(distribution);

        this.charts.scoreChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Students',
                    data: data,
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.7)',
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(251, 191, 36, 0.7)',
                        'rgba(34, 197, 94, 0.7)',
                        'rgba(16, 185, 129, 0.7)'
                    ],
                    borderColor: [
                        'rgb(239, 68, 68)',
                        'rgb(245, 158, 11)',
                        'rgb(251, 191, 36)',
                        'rgb(34, 197, 94)',
                        'rgb(16, 185, 129)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 13 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    /**
     * Create subject performance chart
     * @param {Object} subjectStats - Subject statistics
     */
    createSubjectPerformanceChart(subjectStats) {
        const ctx = document.getElementById('subjectChart');
        if (!ctx) return;

        const subjects = Object.keys(subjectStats);
        const avgScores = subjects.map(subject => 
            subjectStats[subject].averageScore
        );

        this.charts.subjectChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: subjects,
                datasets: [{
                    label: 'Average Score (%)',
                    data: avgScores,
                    borderColor: 'rgb(79, 70, 229)',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgb(79, 70, 229)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return `Average: ${context.parsed.y.toFixed(1)}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Create semester trends chart
     * @param {Object} semesterStats - Semester statistics
     */
    createSemesterTrendsChart(semesterStats) {
        const ctx = document.getElementById('semesterChart');
        if (!ctx) return;

        const semesters = Object.keys(semesterStats).sort((a, b) => {
            return parseInt(a) - parseInt(b);
        });
        const avgScores = semesters.map(sem => 
            semesterStats[sem].averageScore
        );
        const avgAttendance = semesters.map(sem => 
            semesterStats[sem].averageAttendance
        );

        this.charts.semesterChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: semesters.map(s => `Semester ${s}`),
                datasets: [
                    {
                        label: 'Average Score',
                        data: avgScores,
                        backgroundColor: 'rgba(79, 70, 229, 0.7)',
                        borderColor: 'rgb(79, 70, 229)',
                        borderWidth: 2,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Average Attendance',
                        data: avgAttendance,
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: 'rgb(16, 185, 129)',
                        borderWidth: 2,
                        yAxisID: 'y1',
                        type: 'line',
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Create attendance overview chart
     * @param {Object} attendanceDistribution - Attendance distribution
     */
    createAttendanceChart(attendanceDistribution) {
        const ctx = document.getElementById('attendanceChart');
        if (!ctx) return;

        const labels = Object.keys(attendanceDistribution);
        const data = Object.values(attendanceDistribution);

        this.charts.attendanceChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels.map(range => `${range}%`),
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(251, 191, 36, 0.8)',
                        'rgba(16, 185, 129, 0.8)'
                    ],
                    borderColor: [
                        'rgb(239, 68, 68)',
                        'rgb(245, 158, 11)',
                        'rgb(251, 191, 36)',
                        'rgb(16, 185, 129)'
                    ],
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${label}: ${value} students (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Create performance heatmap chart
     * @param {Array} data - Student data array
     */
    createHeatmapChart(data) {
        const ctx = document.getElementById('heatmapChart');
        if (!ctx) return;

        // Group by subject and semester
        const heatmapData = {};
        data.forEach(item => {
            const key = `${item.subject || 'Unknown'}-${item.semester || 'Unknown'}`;
            if (!heatmapData[key]) {
                heatmapData[key] = { count: 0, total: 0 };
            }
            heatmapData[key].count++;
            heatmapData[key].total += item.marks || 0;
        });

        const subjects = [...new Set(data.map(d => d.subject).filter(Boolean))];
        const semesters = [...new Set(data.map(d => d.semester).filter(Boolean))].sort();

        const datasets = semesters.map((sem, semIndex) => {
            const values = subjects.map(subj => {
                const key = `${subj}-${sem}`;
                const item = heatmapData[key];
                return item ? (item.total / item.count) : 0;
            });

            return {
                label: `Semester ${sem}`,
                data: values,
                backgroundColor: `rgba(${79 + semIndex * 30}, ${70 + semIndex * 20}, ${229 - semIndex * 20}, 0.7)`,
                borderColor: `rgb(${79 + semIndex * 30}, ${70 + semIndex * 20}, ${229 - semIndex * 20})`,
                borderWidth: 2
            };
        });

        this.charts.heatmapChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: subjects,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Create risk distribution chart
     * @param {Array} data - Student data array with risk levels
     */
    createRiskDistributionChart(data) {
        const ctx = document.getElementById('riskChart');
        if (!ctx) return;

        const riskCounts = {
            high: 0,
            medium: 0,
            low: 0,
            none: 0
        };

        data.forEach(item => {
            const riskLevel = item.riskLevel || 'none';
            if (riskCounts.hasOwnProperty(riskLevel)) {
                riskCounts[riskLevel]++;
            }
        });

        const labels = Object.keys(riskCounts).map(key => 
            key.charAt(0).toUpperCase() + key.slice(1) + ' Risk'
        );
        const values = Object.values(riskCounts);

        this.charts.riskChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)'
                    ],
                    borderColor: [
                        'rgb(239, 68, 68)',
                        'rgb(245, 158, 11)',
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)'
                    ],
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${label}: ${value} students (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Update chart theme based on current theme
     */
    updateChartTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#f1f5f9' : '#1e293b';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options) {
                if (chart.options.scales) {
                    Object.values(chart.options.scales).forEach(scale => {
                        if (scale.ticks) {
                            scale.ticks.color = textColor;
                        }
                        if (scale.grid) {
                            scale.grid.color = gridColor;
                        }
                    });
                }
                if (chart.options.plugins && chart.options.plugins.legend) {
                    chart.options.plugins.legend.labels.color = textColor;
                }
                chart.update();
            }
        });
    }
}

// Export singleton instance
const visualizationEngine = new VisualizationEngine();
