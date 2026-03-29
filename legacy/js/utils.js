/**
 * UTILITY FUNCTIONS
 * Reusable helper functions for the Student Analytics Dashboard
 */

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return num.toLocaleString('en-US');
}

/**
 * Format percentage
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
function formatPercentage(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (error, success, warning)
 */
function showToast(message, type = 'error') {
    const toast = document.getElementById('errorToast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    
    // Update icon based on type
    const toastIcon = toast.querySelector('.toast-icon');
    if (toastIcon) {
        toastIcon.textContent = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '❌';
    }
    
    toast.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

/**
 * Close toast notification
 */
function closeToast() {
    const toast = document.getElementById('errorToast');
    if (toast) {
        toast.classList.remove('show');
    }
}

/**
 * Show loading overlay
 * @param {string} text - Loading text
 */
function showLoading(text = 'Processing data...') {
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    if (overlay) {
        overlay.style.display = 'flex';
    }
    if (loadingText) {
        loadingText.textContent = text;
    }
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

/**
 * Get risk badge class based on risk level
 * @param {string} riskLevel - Risk level (high, medium, low, none)
 * @returns {string} CSS class name
 */
function getRiskBadgeClass(riskLevel) {
    const riskMap = {
        'high': 'high',
        'medium': 'medium',
        'low': 'low',
        'none': 'none'
    };
    return riskMap[riskLevel] || 'none';
}

/**
 * Get trend indicator HTML
 * @param {string} trend - Trend direction (up, down, stable)
 * @returns {HTMLElement} HTML element
 */
function getTrendIndicator(trend) {
    const indicators = {
        'up': '📈',
        'down': '📉',
        'stable': '➡️'
    };
    const emoji = indicators[trend] || '➡️';
    const span = document.createElement('span');
    span.className = `trend-indicator ${trend}`;
    span.textContent = emoji;
    return span;
}

/**
 * Validate CSV file
 * @param {File} file - File to validate
 * @returns {boolean} True if valid
 */
function validateCSVFile(file) {
    if (!file) {
        showToast('Please select a file', 'error');
        return false;
    }
    
    if (!file.name.endsWith('.csv')) {
        showToast('Please upload a CSV file', 'error');
        return false;
    }
    
    if (file.size === 0) {
        showToast('File is empty', 'error');
        return false;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showToast('File size exceeds 10MB limit', 'error');
        return false;
    }
    
    return true;
}

/**
 * Download data as CSV
 * @param {Array} data - Data array to download
 * @param {string} filename - Filename for download
 */
function downloadCSV(data, filename = 'student-data.csv') {
    if (!data || data.length === 0) {
        showToast('No data to export', 'error');
        return;
    }
    
    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                const value = row[header];
                // Handle values with commas or quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value ?? '';
            }).join(',')
        )
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Data exported successfully', 'success');
}

/**
 * Get theme from localStorage or system preference
 * @returns {string} Theme name
 */
function getTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Set theme
 * @param {string} theme - Theme name (light or dark)
 */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle icon
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

/**
 * Initialize theme on page load
 */
function initTheme() {
    const theme = getTheme();
    setTheme(theme);
}

/**
 * Toggle theme between light and dark
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

/**
 * Calculate percentage
 * @param {number} part - Part value
 * @param {number} total - Total value
 * @returns {number} Percentage
 */
function calculatePercentage(part, total) {
    if (total === 0) return 0;
    return (part / total) * 100;
}

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
function groupBy(array, key) {
    return array.reduce((result, item) => {
        const groupKey = item[key];
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
}

/**
 * Sort array by key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} direction - Sort direction (asc or desc)
 * @returns {Array} Sorted array
 */
function sortBy(array, key, direction = 'asc') {
    const sorted = [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (typeof aVal === 'string') {
            return direction === 'asc' 
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }
        
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
    
    return sorted;
}

/**
 * Filter array by multiple criteria
 * @param {Array} array - Array to filter
 * @param {Object} filters - Filter criteria object
 * @returns {Array} Filtered array
 */
function filterArray(array, filters) {
    return array.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value || value === '') return true;
            
            const itemValue = item[key];
            
            if (typeof itemValue === 'string') {
                return itemValue.toLowerCase().includes(value.toLowerCase());
            }
            
            if (typeof itemValue === 'number') {
                if (typeof value === 'string' && value.includes('-')) {
                    const [min, max] = value.split('-').map(Number);
                    return itemValue >= min && itemValue <= max;
                }
                return itemValue === Number(value);
            }
            
            return itemValue === value;
        });
    });
}
