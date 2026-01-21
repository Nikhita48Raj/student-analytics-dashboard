/**
 * ANALYTICS ENGINE
 * Performs calculations, aggregations, and generates insights
 */

class AnalyticsEngine {
    constructor() {
        this.data = [];
        this.metrics = {};
    }

    /**
     * Set data for analysis
     * @param {Array} data - Student data array
     */
    setData(data) {
        this.data = data;
        this.calculateMetrics();
    }

    /**
     * Calculate all metrics
     */
    calculateMetrics() {
        if (!this.data || this.data.length === 0) {
            this.metrics = this.getEmptyMetrics();
            return;
        }

        this.metrics = {
            totalStudents: this.getTotalStudents(),
            uniqueStudents: this.getUniqueStudents(),
            averageScore: this.getAverageScore(),
            averageAttendance: this.getAverageAttendance(),
            passRate: this.getPassRate(),
            failRate: this.getFailRate(),
            subjectStats: this.getSubjectStats(),
            semesterStats: this.getSemesterStats(),
            scoreDistribution: this.getScoreDistribution(),
            attendanceDistribution: this.getAttendanceDistribution(),
            topPerformers: this.getTopPerformers(10),
            bottomPerformers: this.getBottomPerformers(10)
        };
    }

    /**
     * Get empty metrics object
     * @returns {Object} Empty metrics
     */
    getEmptyMetrics() {
        return {
            totalStudents: 0,
            uniqueStudents: 0,
            averageScore: 0,
            averageAttendance: 0,
            passRate: 0,
            failRate: 0,
            subjectStats: {},
            semesterStats: {},
            scoreDistribution: {},
            attendanceDistribution: {},
            topPerformers: [],
            bottomPerformers: []
        };
    }

    /**
     * Get total number of records
     * @returns {number} Total records
     */
    getTotalStudents() {
        return this.data.length;
    }

    /**
     * Get unique student count
     * @returns {number} Unique students
     */
    getUniqueStudents() {
        const uniqueIds = new Set(this.data.map(d => d.studentId));
        return uniqueIds.size;
    }

    /**
     * Calculate average score
     * @returns {number} Average score
     */
    getAverageScore() {
        if (this.data.length === 0) return 0;
        const sum = this.data.reduce((acc, d) => acc + (d.marks || 0), 0);
        return sum / this.data.length;
    }

    /**
     * Calculate average attendance
     * @returns {number} Average attendance
     */
    getAverageAttendance() {
        if (this.data.length === 0) return 0;
        const sum = this.data.reduce((acc, d) => acc + (d.attendance || 0), 0);
        return sum / this.data.length;
    }

    /**
     * Calculate pass rate (assuming 50% is passing)
     * @returns {number} Pass rate percentage
     */
    getPassRate() {
        if (this.data.length === 0) return 0;
        const passingThreshold = 50;
        const passed = this.data.filter(d => (d.marks || 0) >= passingThreshold).length;
        return calculatePercentage(passed, this.data.length);
    }

    /**
     * Calculate fail rate
     * @returns {number} Fail rate percentage
     */
    getFailRate() {
        return 100 - this.getPassRate();
    }

    /**
     * Get statistics by subject
     * @returns {Object} Subject statistics
     */
    getSubjectStats() {
        const grouped = groupBy(this.data, 'subject');
        const stats = {};

        Object.keys(grouped).forEach(subject => {
            const subjectData = grouped[subject];
            const scores = subjectData.map(d => d.marks || 0);
            const attendances = subjectData.map(d => d.attendance || 0);

            stats[subject] = {
                count: subjectData.length,
                averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
                averageAttendance: attendances.reduce((a, b) => a + b, 0) / attendances.length,
                maxScore: Math.max(...scores),
                minScore: Math.min(...scores),
                passRate: calculatePercentage(
                    scores.filter(s => s >= 50).length,
                    scores.length
                )
            };
        });

        return stats;
    }

    /**
     * Get statistics by semester
     * @returns {Object} Semester statistics
     */
    getSemesterStats() {
        const grouped = groupBy(this.data, 'semester');
        const stats = {};

        Object.keys(grouped).forEach(semester => {
            const semesterData = grouped[semester];
            const scores = semesterData.map(d => d.marks || 0);
            const attendances = semesterData.map(d => d.attendance || 0);

            stats[semester] = {
                count: semesterData.length,
                averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
                averageAttendance: attendances.reduce((a, b) => a + b, 0) / attendances.length,
                uniqueStudents: new Set(semesterData.map(d => d.studentId)).size
            };
        });

        return stats;
    }

    /**
     * Get score distribution
     * @returns {Object} Score distribution by ranges
     */
    getScoreDistribution() {
        const ranges = {
            '0-20': 0,
            '21-40': 0,
            '41-60': 0,
            '61-80': 0,
            '81-100': 0
        };

        this.data.forEach(d => {
            const score = d.marks || 0;
            if (score <= 20) ranges['0-20']++;
            else if (score <= 40) ranges['21-40']++;
            else if (score <= 60) ranges['41-60']++;
            else if (score <= 80) ranges['61-80']++;
            else ranges['81-100']++;
        });

        return ranges;
    }

    /**
     * Get attendance distribution
     * @returns {Object} Attendance distribution by ranges
     */
    getAttendanceDistribution() {
        const ranges = {
            '0-50': 0,
            '51-70': 0,
            '71-85': 0,
            '86-100': 0
        };

        this.data.forEach(d => {
            const attendance = d.attendance || 0;
            if (attendance <= 50) ranges['0-50']++;
            else if (attendance <= 70) ranges['51-70']++;
            else if (attendance <= 85) ranges['71-85']++;
            else ranges['86-100']++;
        });

        return ranges;
    }

    /**
     * Get top performers
     * @param {number} limit - Number of top performers
     * @returns {Array} Top performers array
     */
    getTopPerformers(limit = 10) {
        // Group by student and calculate average
        const studentAverages = {};
        
        this.data.forEach(d => {
            if (!studentAverages[d.studentId]) {
                studentAverages[d.studentId] = {
                    studentId: d.studentId,
                    name: d.name,
                    scores: [],
                    attendances: []
                };
            }
            studentAverages[d.studentId].scores.push(d.marks || 0);
            studentAverages[d.studentId].attendances.push(d.attendance || 0);
        });

        const students = Object.values(studentAverages).map(student => ({
            studentId: student.studentId,
            name: student.name,
            averageScore: student.scores.reduce((a, b) => a + b, 0) / student.scores.length,
            averageAttendance: student.attendances.reduce((a, b) => a + b, 0) / student.attendances.length
        }));

        return students
            .sort((a, b) => b.averageScore - a.averageScore)
            .slice(0, limit);
    }

    /**
     * Get bottom performers
     * @param {number} limit - Number of bottom performers
     * @returns {Array} Bottom performers array
     */
    getBottomPerformers(limit = 10) {
        const studentAverages = {};
        
        this.data.forEach(d => {
            if (!studentAverages[d.studentId]) {
                studentAverages[d.studentId] = {
                    studentId: d.studentId,
                    name: d.name,
                    scores: [],
                    attendances: []
                };
            }
            studentAverages[d.studentId].scores.push(d.marks || 0);
            studentAverages[d.studentId].attendances.push(d.attendance || 0);
        });

        const students = Object.values(studentAverages).map(student => ({
            studentId: student.studentId,
            name: student.name,
            averageScore: student.scores.reduce((a, b) => a + b, 0) / student.scores.length,
            averageAttendance: student.attendances.reduce((a, b) => a + b, 0) / student.attendances.length
        }));

        return students
            .sort((a, b) => a.averageScore - b.averageScore)
            .slice(0, limit);
    }

    /**
     * Get student performance trend
     * @param {string} studentId - Student ID
     * @returns {Object} Trend data
     */
    getStudentTrend(studentId) {
        const studentData = this.data
            .filter(d => d.studentId === studentId)
            .sort((a, b) => {
                // Sort by semester if available
                const semA = parseInt(a.semester) || 0;
                const semB = parseInt(b.semester) || 0;
                return semA - semB;
            });

        if (studentData.length < 2) {
            return { trend: 'stable', change: 0 };
        }

        const firstScore = studentData[0].marks || 0;
        const lastScore = studentData[studentData.length - 1].marks || 0;
        const change = lastScore - firstScore;

        let trend = 'stable';
        if (change > 5) trend = 'up';
        else if (change < -5) trend = 'down';

        return { trend, change: change.toFixed(1) };
    }

    /**
     * Get all metrics
     * @returns {Object} All calculated metrics
     */
    getMetrics() {
        return this.metrics;
    }

    /**
     * Generate smart insights
     * @returns {Array} Array of insight objects
     */
    generateInsights() {
        const insights = [];
        const metrics = this.metrics;

        // Pass rate insight
        if (metrics.passRate < 60) {
            insights.push({
                type: 'warning',
                icon: '⚠️',
                title: 'Low Pass Rate',
                content: `Only ${formatPercentage(metrics.passRate)} of students are passing. Consider reviewing curriculum and support systems.`
            });
        } else if (metrics.passRate > 85) {
            insights.push({
                type: 'success',
                icon: '✅',
                title: 'Excellent Pass Rate',
                content: `${formatPercentage(metrics.passRate)} pass rate indicates strong academic performance across the cohort.`
            });
        }

        // Attendance insight
        if (metrics.averageAttendance < 70) {
            insights.push({
                type: 'warning',
                icon: '📅',
                title: 'Attendance Concern',
                content: `Average attendance is ${formatPercentage(metrics.averageAttendance)}. Low attendance may impact learning outcomes.`
            });
        }

        // Subject performance insight
        const subjectStats = metrics.subjectStats;
        const worstSubject = Object.entries(subjectStats)
            .sort((a, b) => a[1].averageScore - b[1].averageScore)[0];
        
        if (worstSubject && worstSubject[1].averageScore < 50) {
            insights.push({
                type: 'danger',
                icon: '📚',
                title: 'Subject Performance Alert',
                content: `${worstSubject[0]} shows the lowest average score (${formatPercentage(worstSubject[1].averageScore)}). Additional support may be needed.`
            });
        }

        // Score distribution insight
        const distribution = metrics.scoreDistribution;
        const lowScores = (distribution['0-20'] || 0) + (distribution['21-40'] || 0);
        const lowScorePercentage = calculatePercentage(lowScores, metrics.totalStudents);
        
        if (lowScorePercentage > 30) {
            insights.push({
                type: 'warning',
                icon: '📊',
                title: 'Score Distribution Alert',
                content: `${formatPercentage(lowScorePercentage)} of students are scoring below 40%. Consider intervention strategies.`
            });
        }

        // Top performer insight
        if (metrics.topPerformers.length > 0) {
            const topPerformer = metrics.topPerformers[0];
            insights.push({
                type: 'success',
                icon: '🌟',
                title: 'Top Performer',
                content: `${topPerformer.name} leads with an average score of ${formatPercentage(topPerformer.averageScore)}.`
            });
        }

        return insights;
    }
}

// Export singleton instance
const analyticsEngine = new AnalyticsEngine();
