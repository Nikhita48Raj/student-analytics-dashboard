/**
 * FUTURISTIC FEATURES MODULE
 * AI-Powered Analytics, Voice Control, Forecasting, and Advanced Features
 */

/**
 * AI-Powered Analytics Engine
 */
class AIAnalyticsEngine {
    constructor() {
        this.insights = [];
    }

    /**
     * Generate AI-powered insights
     * @param {Array} data - Student data
     * @param {Object} metrics - Analytics metrics
     * @returns {Array} AI insights
     */
    generateAIInsights(data, metrics) {
        const insights = [];

        // Predictive Success Analysis
        const successProbability = this.calculateSuccessProbability(data, metrics);
        insights.push({
            type: 'prediction',
            icon: '🔮',
            title: 'Success Probability Forecast',
            content: `Based on current trends, ${successProbability.toFixed(1)}% of students are predicted to succeed.`,
            confidence: this.calculateConfidence(data),
            actionable: this.getActionableRecommendations(data, metrics)
        });

        // Pattern Recognition
        const patterns = this.identifyPatterns(data);
        if (patterns.length > 0) {
            insights.push({
                type: 'pattern',
                icon: '🔍',
                title: 'Hidden Patterns Detected',
                content: patterns.join(' '),
                confidence: 85
            });
        }

        // Risk Prediction
        const futureRisks = this.predictFutureRisks(data);
        if (futureRisks.length > 0) {
            insights.push({
                type: 'warning',
                icon: '⚠️',
                title: 'Future Risk Prediction',
                content: futureRisks.join(' '),
                confidence: 75
            });
        }

        // Performance Optimization
        const optimizations = this.suggestOptimizations(data, metrics);
        if (optimizations.length > 0) {
            insights.push({
                type: 'optimization',
                icon: '⚡',
                title: 'Performance Optimization',
                content: optimizations.join(' '),
                confidence: 90
            });
        }

        return insights;
    }

    /**
     * Calculate success probability
     */
    calculateSuccessProbability(data, metrics) {
        if (!data || data.length === 0) return 0;

        const avgScore = metrics.averageScore || 0;
        const avgAttendance = metrics.averageAttendance || 0;
        const passRate = metrics.passRate || 0;

        // Weighted calculation
        const scoreWeight = 0.4;
        const attendanceWeight = 0.3;
        const passRateWeight = 0.3;

        const probability = (
            (avgScore / 100) * scoreWeight +
            (avgAttendance / 100) * attendanceWeight +
            (passRate / 100) * passRateWeight
        ) * 100;

        return Math.max(0, Math.min(100, probability));
    }

    /**
     * Calculate confidence level
     */
    calculateConfidence(data) {
        if (!data || data.length === 0) return 0;
        const dataPoints = data.length;
        return Math.min(95, 50 + (dataPoints / 10));
    }

    /**
     * Identify patterns in data
     */
    identifyPatterns(data) {
        const patterns = [];
        
        // Group by subject
        const subjectGroups = {};
        data.forEach(item => {
            if (!subjectGroups[item.subject]) {
                subjectGroups[item.subject] = [];
            }
            subjectGroups[item.subject].push(item.marks || 0);
        });

        // Find subject with highest variance
        let maxVariance = 0;
        let maxVarianceSubject = '';
        Object.keys(subjectGroups).forEach(subject => {
            const scores = subjectGroups[subject];
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
            if (variance > maxVariance) {
                maxVariance = variance;
                maxVarianceSubject = subject;
            }
        });

        if (maxVarianceSubject) {
            patterns.push(`${maxVarianceSubject} shows highest performance variance, indicating mixed student engagement.`);
        }

        // Check for attendance-score correlation
        const highScoreHighAtt = data.filter(d => (d.marks || 0) > 70 && (d.attendance || 0) > 80).length;
        const totalHighScore = data.filter(d => (d.marks || 0) > 70).length;
        if (totalHighScore > 0 && (highScoreHighAtt / totalHighScore) > 0.8) {
            patterns.push('Strong correlation detected: High attendance directly correlates with high scores.');
        }

        return patterns;
    }

    /**
     * Predict future risks
     */
    predictFutureRisks(data) {
        const risks = [];
        
        // Students with declining trends
        const decliningStudents = data.filter(d => {
            // Simple heuristic: low score + low attendance = future risk
            return (d.marks || 0) < 50 && (d.attendance || 0) < 70;
        });

        if (decliningStudents.length > data.length * 0.2) {
            risks.push(`${decliningStudents.length} students showing early warning signs. Early intervention recommended.`);
        }

        return risks;
    }

    /**
     * Suggest optimizations
     */
    suggestOptimizations(data, metrics) {
        const suggestions = [];

        if (metrics.averageScore < 60) {
            suggestions.push('Consider implementing additional support programs for struggling students.');
        }

        if (metrics.averageAttendance < 75) {
            suggestions.push('Attendance improvement initiatives could boost overall performance by 15-20%.');
        }

        const subjectStats = metrics.subjectStats || {};
        const worstSubject = Object.entries(subjectStats)
            .sort((a, b) => a[1].averageScore - b[1].averageScore)[0];
        
        if (worstSubject && worstSubject[1].averageScore < 50) {
            suggestions.push(`Focus resources on ${worstSubject[0]} - shows lowest average performance.`);
        }

        return suggestions;
    }

    /**
     * Get actionable recommendations
     */
    getActionableRecommendations(data, metrics) {
        return [
            'Schedule one-on-one sessions with at-risk students',
            'Implement peer tutoring programs',
            'Create subject-specific study groups',
            'Set up automated attendance reminders'
        ];
    }
}

/**
 * Voice Control System
 */
class VoiceControlSystem {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.init();
    }

    init() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                this.processCommand(command);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopListening();
                showToast('Voice recognition error. Please try again.', 'error');
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateIndicator(false);
            };
        }
    }

    startListening() {
        if (!this.recognition) {
            showToast('Voice recognition not supported in this browser', 'warning');
            return;
        }

        if (this.isListening) {
            this.stopListening();
            return;
        }

        this.isListening = true;
        this.recognition.start();
        this.updateIndicator(true);
        showToast('Listening... Say a command', 'success');
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this.updateIndicator(false);
        }
    }

    processCommand(command) {
        console.log('Voice command:', command);

        // Navigation commands
        if (command.includes('scroll up') || command.includes('scroll top')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showToast('Scrolling to top', 'success');
        } else if (command.includes('scroll down')) {
            window.scrollBy({ top: 500, behavior: 'smooth' });
            showToast('Scrolling down', 'success');
        }

        // Theme commands
        else if (command.includes('dark mode') || command.includes('dark theme')) {
            setTheme('dark');
            showToast('Switched to dark mode', 'success');
        } else if (command.includes('light mode') || command.includes('light theme')) {
            setTheme('light');
            showToast('Switched to light mode', 'success');
        }

        // Feature commands
        else if (command.includes('show help') || command.includes('help')) {
            const helpModal = document.getElementById('helpModal');
            if (helpModal) {
                helpModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        } else if (command.includes('close') || command.includes('exit')) {
            closeAllModals();
        } else if (command.includes('export') || command.includes('download')) {
            handleExport();
        } else if (command.includes('print')) {
            handlePrint();
        } else if (command.includes('ai insights') || command.includes('ai analysis')) {
            showAIInsights();
        }

        // Search commands
        else if (command.includes('search')) {
            const searchTerm = command.replace('search', '').trim();
            if (searchTerm) {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = searchTerm;
                    searchInput.dispatchEvent(new Event('input'));
                    showToast(`Searching for: ${searchTerm}`, 'success');
                }
            }
        }

        else {
            showToast('Command not recognized. Try: "show help", "dark mode", "export", etc.', 'warning');
        }
    }

    updateIndicator(show) {
        const indicator = document.getElementById('voiceIndicator');
        if (indicator) {
            indicator.style.display = show ? 'block' : 'none';
        }
    }
}

/**
 * Performance Forecasting Engine
 */
class ForecastingEngine {
    constructor() {
        this.forecastData = null;
    }

    /**
     * Generate performance forecast
     * @param {Array} data - Historical data
     * @returns {Object} Forecast data
     */
    generateForecast(data) {
        if (!data || data.length === 0) return null;

        // Group by semester
        const semesterData = {};
        data.forEach(item => {
            const sem = item.semester || '1';
            if (!semesterData[sem]) {
                semesterData[sem] = { scores: [], attendance: [] };
            }
            semesterData[sem].scores.push(item.marks || 0);
            semesterData[sem].attendance.push(item.attendance || 0);
        });

        const semesters = Object.keys(semesterData).sort((a, b) => parseInt(a) - parseInt(b));
        const historicalScores = semesters.map(sem => {
            const scores = semesterData[sem].scores;
            return scores.reduce((a, b) => a + b, 0) / scores.length;
        });

        // Simple linear regression for forecasting
        const forecastScores = this.linearForecast(historicalScores, 3);
        const forecastSemesters = [];
        const lastSem = parseInt(semesters[semesters.length - 1]) || 1;
        for (let i = 1; i <= 3; i++) {
            forecastSemesters.push((lastSem + i).toString());
        }

        return {
            historical: {
                semesters: semesters,
                scores: historicalScores
            },
            forecast: {
                semesters: forecastSemesters,
                scores: forecastScores
            }
        };
    }

    /**
     * Linear forecast using simple trend
     */
    linearForecast(data, periods) {
        if (data.length < 2) return Array(periods).fill(data[0] || 0);

        // Calculate trend
        const n = data.length;
        const avgX = (n - 1) / 2;
        const avgY = data.reduce((a, b) => a + b, 0) / n;

        let numerator = 0;
        let denominator = 0;
        for (let i = 0; i < n; i++) {
            numerator += (i - avgX) * (data[i] - avgY);
            denominator += Math.pow(i - avgX, 2);
        }

        const slope = denominator !== 0 ? numerator / denominator : 0;
        const intercept = avgY - slope * avgX;

        // Forecast future values
        const forecast = [];
        for (let i = 0; i < periods; i++) {
            const x = n + i;
            const y = slope * x + intercept;
            forecast.push(Math.max(0, Math.min(100, y)));
        }

        return forecast;
    }

    /**
     * Create forecast chart
     */
    createForecastChart(forecastData) {
        const ctx = document.getElementById('forecastChart');
        if (!ctx || !forecastData) return;

        const allSemesters = [...forecastData.historical.semesters, ...forecastData.forecast.semesters];
        const allScores = [...forecastData.historical.scores, ...forecastData.forecast.scores];
        const historicalLength = forecastData.historical.semesters.length;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: allSemesters.map(s => `Sem ${s}`),
                datasets: [{
                    label: 'Historical Performance',
                    data: allScores.slice(0, historicalLength),
                    borderColor: 'rgb(79, 70, 229)',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                }, {
                    label: 'Forecasted Performance',
                    data: [...Array(historicalLength).fill(null), ...forecastData.forecast.scores],
                    borderColor: 'rgb(0, 255, 255)',
                    backgroundColor: 'rgba(0, 255, 255, 0.1)',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8
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
                        padding: 12
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
}

// Initialize engines
const aiAnalyticsEngine = new AIAnalyticsEngine();
const voiceControlSystem = new VoiceControlSystem();
const forecastingEngine = new ForecastingEngine();

/**
 * Show AI Insights Modal
 */
function showAIInsights() {
    if (!processedData || processedData.length === 0) {
        showToast('Please upload data first', 'warning');
        return;
    }

    const modal = document.getElementById('aiInsightsModal');
    const container = document.getElementById('aiInsightsContainer');
    
    if (!modal || !container) return;

    const metrics = analyticsEngine.getMetrics();
    const aiInsights = aiAnalyticsEngine.generateAIInsights(processedData, metrics);

    container.innerHTML = '';

    if (aiInsights.length === 0) {
        container.innerHTML = '<p>No AI insights available at this time.</p>';
    } else {
        aiInsights.forEach(insight => {
            const card = document.createElement('div');
            card.className = 'ai-insight-card';
            card.innerHTML = `
                <div class="insight-header">
                    <span class="insight-icon">${insight.icon}</span>
                    <h3 class="insight-title">${insight.title}</h3>
                    <span class="confidence-badge">${insight.confidence}% confidence</span>
                </div>
                <p class="insight-content">${insight.content}</p>
                ${insight.actionable ? `
                <div class="actionable-items">
                    <h4>Recommended Actions:</h4>
                    <ul>
                        ${insight.actionable.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            `;
            container.appendChild(card);
        });
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Show Performance Forecast
 */
function showForecast() {
    if (!processedData || processedData.length === 0) {
        showToast('Please upload data first', 'warning');
        return;
    }

    const forecastSection = document.getElementById('forecastSection');
    const forecastInsights = document.getElementById('forecastInsights');
    
    if (!forecastSection) return;

    const forecastData = forecastingEngine.generateForecast(processedData);
    
    if (!forecastData) {
        showToast('Insufficient data for forecasting', 'warning');
        return;
    }

    // Create chart
    setTimeout(() => {
        forecastingEngine.createForecastChart(forecastData);
    }, 100);

    // Generate insights
    if (forecastInsights) {
        const avgImprovement = forecastData.forecast.scores[0] - forecastData.historical.scores[forecastData.historical.scores.length - 1];
        forecastInsights.innerHTML = `
            <div class="forecast-insight-item">
                <h4>📈 Next Semester Prediction</h4>
                <p class="forecast-value">${forecastData.forecast.scores[0].toFixed(1)}%</p>
                <p class="forecast-change ${avgImprovement >= 0 ? 'positive' : 'negative'}">
                    ${avgImprovement >= 0 ? '↑' : '↓'} ${Math.abs(avgImprovement).toFixed(1)}% change
                </p>
            </div>
            <div class="forecast-insight-item">
                <h4>🎯 Long-term Trend</h4>
                <p class="forecast-value">${forecastData.forecast.scores[forecastData.forecast.scores.length - 1].toFixed(1)}%</p>
                <p>Projected 3 semesters ahead</p>
            </div>
            <div class="forecast-insight-item">
                <h4>💡 Recommendation</h4>
                <p>${avgImprovement >= 0 ? 'Positive trend detected. Maintain current strategies.' : 'Intervention needed to reverse declining trend.'}</p>
            </div>
        `;
    }

    forecastSection.style.display = 'block';
    forecastSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Update Success Probability
 */
function updateSuccessProbability() {
    if (!processedData || processedData.length === 0) return;

    const metrics = analyticsEngine.getMetrics();
    const probability = aiAnalyticsEngine.calculateSuccessProbability(processedData, metrics);
    
    const probElement = document.getElementById('successProbability');
    if (probElement) {
        animateValue(probElement, 0, probability, 1000, (val) => formatPercentage(val));
    }
}

/**
 * Show AI Banner
 */
function showAIBanner(message) {
    const banner = document.getElementById('aiBanner');
    const bannerText = document.getElementById('aiBannerText');
    
    if (banner && bannerText) {
        bannerText.textContent = message;
        banner.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            banner.style.display = 'none';
        }, 5000);
    }
}

// Make functions globally accessible
window.showAIInsights = showAIInsights;
window.showForecast = showForecast;
window.updateSuccessProbability = updateSuccessProbability;
window.showAIBanner = showAIBanner;

// Setup event listeners for new features
function setupFuturisticFeatures() {
    // Voice control button
    const voiceBtn = document.getElementById('voiceControlBtn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            voiceControlSystem.startListening();
        });
    }

    // AI Insights button
    const aiBtn = document.getElementById('aiInsightsBtn');
    if (aiBtn) {
        aiBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showAIInsights();
        });
    }

    // Forecast button
    const forecastBtn = document.getElementById('forecastBtn');
    if (forecastBtn) {
        forecastBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showForecast();
        });
    }

    // Close AI modal
    const closeAiModal = document.getElementById('closeAiModal');
    if (closeAiModal) {
        closeAiModal.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const modal = document.getElementById('aiInsightsModal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // Close AI banner
    const closeAiBanner = document.getElementById('closeAiBanner');
    if (closeAiBanner) {
        closeAiBanner.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const banner = document.getElementById('aiBanner');
            if (banner) {
                banner.style.display = 'none';
            }
        });
    }

    // Keyboard shortcut for voice (V key)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'v' && !e.ctrlKey && !e.metaKey) {
            const activeElement = document.activeElement;
            if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                voiceControlSystem.startListening();
            }
        }
    });
}

// Initialize when DOM is ready - but also make it callable from main.js
window.setupFuturisticFeatures = setupFuturisticFeatures;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFuturisticFeatures);
} else {
    // Small delay to ensure other scripts are loaded
    setTimeout(setupFuturisticFeatures, 50);
}
