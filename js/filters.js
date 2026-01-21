/**
 * FILTER & SORT MODULE
 * Handles search, filtering, and sorting functionality
 */

class FilterEngine {
    constructor() {
        this.originalData = [];
        this.filteredData = [];
        this.currentFilters = {
            search: '',
            subject: '',
            semester: '',
            riskLevel: ''
        };
        this.currentSort = {
            key: 'name',
            direction: 'asc'
        };
    }

    /**
     * Set data to filter
     * @param {Array} data - Student data array
     */
    setData(data) {
        this.originalData = data;
        this.applyFilters();
    }

    /**
     * Set search query
     * @param {string} query - Search query
     */
    setSearch(query) {
        this.currentFilters.search = query.toLowerCase().trim();
        this.applyFilters();
    }

    /**
     * Set subject filter
     * @param {string} subject - Subject to filter by
     */
    setSubjectFilter(subject) {
        this.currentFilters.subject = subject;
        this.applyFilters();
    }

    /**
     * Set semester filter
     * @param {string} semester - Semester to filter by
     */
    setSemesterFilter(semester) {
        this.currentFilters.semester = semester;
        this.applyFilters();
    }

    /**
     * Set risk level filter
     * @param {string} riskLevel - Risk level to filter by
     */
    setRiskFilter(riskLevel) {
        this.currentFilters.riskLevel = riskLevel;
        this.applyFilters();
    }

    /**
     * Set sort criteria
     * @param {string} sortKey - Key to sort by (e.g., 'name-asc', 'score-desc')
     */
    setSort(sortKey) {
        const [key, direction] = sortKey.split('-');
        this.currentSort = { key, direction };
        this.applyFilters();
    }

    /**
     * Apply all filters and sorting
     */
    applyFilters() {
        let filtered = [...this.originalData];

        // Apply search filter
        if (this.currentFilters.search) {
            filtered = filtered.filter(item => {
                const searchLower = this.currentFilters.search;
                return (
                    (item.name && item.name.toLowerCase().includes(searchLower)) ||
                    (item.studentId && item.studentId.toLowerCase().includes(searchLower)) ||
                    (item.subject && item.subject.toLowerCase().includes(searchLower))
                );
            });
        }

        // Apply subject filter
        if (this.currentFilters.subject) {
            filtered = filtered.filter(item => 
                item.subject === this.currentFilters.subject
            );
        }

        // Apply semester filter
        if (this.currentFilters.semester) {
            filtered = filtered.filter(item => 
                item.semester === this.currentFilters.semester
            );
        }

        // Apply risk level filter
        if (this.currentFilters.riskLevel) {
            filtered = filtered.filter(item => 
                item.riskLevel === this.currentFilters.riskLevel
            );
        }

        // Apply sorting
        filtered = this.sortData(filtered);

        this.filteredData = filtered;
    }

    /**
     * Sort data array
     * @param {Array} data - Data to sort
     * @returns {Array} Sorted data
     */
    sortData(data) {
        const { key, direction } = this.currentSort;

        return [...data].sort((a, b) => {
            let aVal, bVal;

            switch (key) {
                case 'name':
                    aVal = (a.name || '').toLowerCase();
                    bVal = (b.name || '').toLowerCase();
                    break;
                case 'score':
                    aVal = a.marks || 0;
                    bVal = b.marks || 0;
                    break;
                case 'attendance':
                    aVal = a.attendance || 0;
                    bVal = b.attendance || 0;
                    break;
                default:
                    aVal = a[key] || '';
                    bVal = b[key] || '';
            }

            if (typeof aVal === 'string') {
                return direction === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }

            return direction === 'asc' ? aVal - bVal : bVal - aVal;
        });
    }

    /**
     * Get filtered data
     * @returns {Array} Filtered and sorted data
     */
    getFilteredData() {
        return this.filteredData;
    }

    /**
     * Get unique subjects from data
     * @returns {Array} Unique subjects
     */
    getUniqueSubjects() {
        const subjects = new Set(this.originalData.map(item => item.subject).filter(Boolean));
        return Array.from(subjects).sort();
    }

    /**
     * Get unique semesters from data
     * @returns {Array} Unique semesters
     */
    getUniqueSemesters() {
        const semesters = new Set(this.originalData.map(item => item.semester).filter(Boolean));
        return Array.from(semesters).sort((a, b) => {
            const numA = parseInt(a) || 0;
            const numB = parseInt(b) || 0;
            return numA - numB;
        });
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.currentFilters = {
            search: '',
            subject: '',
            semester: '',
            riskLevel: ''
        };
        this.currentSort = {
            key: 'name',
            direction: 'asc'
        };
        this.applyFilters();
    }

    /**
     * Get filter summary
     * @returns {Object} Filter summary
     */
    getFilterSummary() {
        return {
            total: this.originalData.length,
            filtered: this.filteredData.length,
            activeFilters: Object.values(this.currentFilters).filter(f => f !== '').length
        };
    }
}

// Export singleton instance
const filterEngine = new FilterEngine();
