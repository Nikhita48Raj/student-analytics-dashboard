/**
 * RISK DETECTION MODULE
 * Identifies at-risk students using rule-based algorithms
 */

class RiskDetectionEngine {
    constructor() {
        this.rules = [
            {
                name: 'Low Score',
                weight: 0.4,
                check: (student) => (student.marks || 0) < 40
            },
            {
                name: 'Very Low Score',
                weight: 0.6,
                check: (student) => (student.marks || 0) < 30
            },
            {
                name: 'Low Attendance',
                weight: 0.3,
                check: (student) => (student.attendance || 0) < 60
            },
            {
                name: 'Very Low Attendance',
                weight: 0.5,
                check: (student) => (student.attendance || 0) < 50
            },
            {
                name: 'Combined Risk',
                weight: 0.7,
                check: (student) => 
                    (student.marks || 0) < 50 && (student.attendance || 0) < 70
            },
            {
                name: 'Critical Risk',
                weight: 0.9,
                check: (student) => 
                    (student.marks || 0) < 35 && (student.attendance || 0) < 60
            }
        ];
    }

    /**
     * Calculate risk score for a student
     * @param {Object} student - Student data object
     * @returns {number} Risk score (0-1)
     */
    calculateRiskScore(student) {
        let riskScore = 0;

        this.rules.forEach(rule => {
            if (rule.check(student)) {
                riskScore += rule.weight;
            }
        });

        // Normalize to 0-1 range
        return Math.min(1, riskScore);
    }

    /**
     * Get risk level based on score
     * @param {number} riskScore - Risk score (0-1)
     * @returns {string} Risk level (high, medium, low, none)
     */
    getRiskLevel(riskScore) {
        if (riskScore >= 0.7) return 'high';
        if (riskScore >= 0.4) return 'medium';
        if (riskScore >= 0.2) return 'low';
        return 'none';
    }

    /**
     * Assess risk for a single student
     * @param {Object} student - Student data object
     * @returns {Object} Risk assessment object
     */
    assessStudent(student) {
        const riskScore = this.calculateRiskScore(student);
        const riskLevel = this.getRiskLevel(riskScore);

        return {
            riskScore: Math.round(riskScore * 100),
            riskLevel,
            factors: this.getRiskFactors(student)
        };
    }

    /**
     * Get risk factors for a student
     * @param {Object} student - Student data object
     * @returns {Array} Array of risk factor strings
     */
    getRiskFactors(student) {
        const factors = [];
        const marks = student.marks || 0;
        const attendance = student.attendance || 0;

        if (marks < 30) {
            factors.push('Very low score (<30%)');
        } else if (marks < 40) {
            factors.push('Low score (<40%)');
        } else if (marks < 50) {
            factors.push('Below passing threshold');
        }

        if (attendance < 50) {
            factors.push('Very low attendance (<50%)');
        } else if (attendance < 60) {
            factors.push('Low attendance (<60%)');
        } else if (attendance < 70) {
            factors.push('Below recommended attendance');
        }

        if (marks < 50 && attendance < 70) {
            factors.push('Combined low performance');
        }

        return factors;
    }

    /**
     * Assess risk for all students
     * @param {Array} students - Array of student data
     * @returns {Array} Array of students with risk assessment
     */
    assessAllStudents(students) {
        return students.map(student => {
            const assessment = this.assessStudent(student);
            return {
                ...student,
                riskScore: assessment.riskScore,
                riskLevel: assessment.riskLevel,
                riskFactors: assessment.factors
            };
        });
    }

    /**
     * Get at-risk students count
     * @param {Array} students - Array of student data with risk assessment
     * @returns {number} Count of at-risk students
     */
    getAtRiskCount(students) {
        return students.filter(s => 
            s.riskLevel === 'high' || s.riskLevel === 'medium'
        ).length;
    }

    /**
     * Get high-risk students
     * @param {Array} students - Array of student data with risk assessment
     * @returns {Array} High-risk students
     */
    getHighRiskStudents(students) {
        return students
            .filter(s => s.riskLevel === 'high')
            .sort((a, b) => b.riskScore - a.riskScore);
    }

    /**
     * Get medium-risk students
     * @param {Array} students - Array of student data with risk assessment
     * @returns {Array} Medium-risk students
     */
    getMediumRiskStudents(students) {
        return students
            .filter(s => s.riskLevel === 'medium')
            .sort((a, b) => b.riskScore - a.riskScore);
    }

    /**
     * Generate risk summary
     * @param {Array} students - Array of student data with risk assessment
     * @returns {Object} Risk summary object
     */
    generateRiskSummary(students) {
        const summary = {
            total: students.length,
            high: 0,
            medium: 0,
            low: 0,
            none: 0,
            atRiskTotal: 0
        };

        students.forEach(student => {
            summary[student.riskLevel]++;
        });

        summary.atRiskTotal = summary.high + summary.medium;

        return summary;
    }

    /**
     * Get risk insights
     * @param {Array} students - Array of student data with risk assessment
     * @returns {Array} Array of insight objects
     */
    getRiskInsights(students) {
        const insights = [];
        const summary = this.generateRiskSummary(students);
        const atRiskPercentage = calculatePercentage(summary.atRiskTotal, summary.total);

        if (summary.high > 0) {
            insights.push({
                type: 'danger',
                icon: '🚨',
                title: 'High-Risk Students Detected',
                content: `${summary.high} students are at high risk. Immediate intervention recommended.`
            });
        }

        if (atRiskPercentage > 20) {
            insights.push({
                type: 'warning',
                icon: '⚠️',
                title: 'Elevated Risk Level',
                content: `${formatPercentage(atRiskPercentage)} of students are at risk. Consider reviewing support programs.`
            });
        }

        if (summary.high === 0 && summary.medium === 0) {
            insights.push({
                type: 'success',
                icon: '✅',
                title: 'Low Risk Profile',
                content: 'No high or medium-risk students detected. Student performance is stable.'
            });
        }

        return insights;
    }
}

// Export singleton instance
const riskDetectionEngine = new RiskDetectionEngine();
