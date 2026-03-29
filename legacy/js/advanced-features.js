/**
 * ADVANCED FEATURES MODULE
 * Additional innovative features for the dashboard
 */

/**
 * Command Palette System
 */
class CommandPalette {
    constructor() {
        this.commands = [
            { id: 'export', label: 'Export Data', icon: '📥', action: () => handleExport() },
            { id: 'print', label: 'Print Report', icon: '🖨️', action: () => handlePrint() },
            { id: 'ai', label: 'AI Insights', icon: '🤖', action: () => showAIInsights() },
            { id: 'forecast', label: 'Performance Forecast', icon: '🔮', action: () => showForecast() },
            { id: 'compare', label: 'Compare Students', icon: '⚖️', action: () => {
                const btn = document.getElementById('compareBtn');
                if (btn) btn.click();
            }},
            { id: 'help', label: 'Show Help', icon: '❓', action: () => {
                const btn = document.getElementById('helpBtn');
                if (btn) btn.click();
            }},
            { id: 'theme', label: 'Toggle Theme', icon: '🌙', action: () => toggleTheme() },
            { id: 'clear', label: 'Clear Filters', icon: '🗑️', action: () => {
                const btn = document.getElementById('clearFiltersBtn');
                if (btn) btn.click();
            }}
        ];
        this.init();
    }

    init() {
        // Ctrl+K or Cmd+K to open
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    toggle() {
        const palette = document.getElementById('commandPalette');
        if (!palette) return;

        if (palette.style.display === 'none' || !palette.style.display) {
            this.open();
        } else {
            this.close();
        }
    }

    open() {
        const palette = document.getElementById('commandPalette');
        const input = document.getElementById('commandInput');
        if (palette && input) {
            palette.style.display = 'block';
            input.focus();
            this.updateResults('');
        }
    }

    close() {
        const palette = document.getElementById('commandPalette');
        const input = document.getElementById('commandInput');
        if (palette) {
            palette.style.display = 'none';
        }
        if (input) {
            input.value = '';
        }
    }

    isOpen() {
        const palette = document.getElementById('commandPalette');
        return palette && palette.style.display === 'block';
    }

    updateResults(query) {
        const results = document.getElementById('paletteResults');
        if (!results) return;

        const filtered = this.commands.filter(cmd => 
            cmd.label.toLowerCase().includes(query.toLowerCase())
        );

        results.innerHTML = '';
        filtered.forEach((cmd, index) => {
            const item = document.createElement('div');
            item.className = 'palette-item';
            item.innerHTML = `
                <span class="palette-icon">${cmd.icon}</span>
                <span class="palette-label">${cmd.label}</span>
                <span class="palette-shortcut">Enter</span>
            `;
            item.addEventListener('click', () => {
                cmd.action();
                this.close();
            });
            if (index === 0) item.classList.add('selected');
            results.appendChild(item);
        });
    }
}

/**
 * Notification System
 */
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 5;
    }

    show(message, type = 'info', duration = 5000) {
        const center = document.getElementById('notificationCenter');
        if (!center) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">${this.getIcon(type)}</div>
            <div class="notification-content">${message}</div>
            <button class="notification-close">×</button>
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.remove(notification));

        center.appendChild(notification);
        this.notifications.push(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        // Limit notifications
        if (this.notifications.length > this.maxNotifications) {
            this.remove(this.notifications[0]);
        }
    }

    remove(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 300);
    }

    getIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || icons.info;
    }
}

/**
 * Table Pagination System
 */
class TablePagination {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.totalItems = 0;
    }

    init() {
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const selectAll = document.getElementById('selectAll');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousPage());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextPage());
        }
        if (selectAll) {
            selectAll.addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
        }
    }

    setTotalItems(total) {
        this.totalItems = total;
        this.updatePagination();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        const pagination = document.getElementById('tablePagination');
        const currentPageEl = document.getElementById('currentPage');
        const totalPagesEl = document.getElementById('totalPages');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        if (totalPages <= 1) {
            if (pagination) pagination.style.display = 'none';
            return;
        }

        if (pagination) pagination.style.display = 'flex';
        if (currentPageEl) currentPageEl.textContent = this.currentPage;
        if (totalPagesEl) totalPagesEl.textContent = totalPages;
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePagination();
            this.refreshTable();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.updatePagination();
            this.refreshTable();
        }
    }

    getCurrentPageData(data) {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return data.slice(start, end);
    }

    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('#studentsTableBody input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = checked);
    }

    refreshTable() {
        if (typeof updateTable === 'function') {
            updateTable();
        }
    }
}

/**
 * Quick Insights Panel
 */
class QuickInsightsPanel {
    constructor() {
        this.isOpen = false;
    }

    toggle() {
        const panel = document.getElementById('insightsPanel');
        if (!panel) return;

        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const panel = document.getElementById('insightsPanel');
        const content = document.getElementById('insightsPanelContent');
        if (!panel || !content) return;

        if (processedData && processedData.length > 0) {
            const metrics = analyticsEngine.getMetrics();
            const topPerformer = metrics.topPerformers[0];
            const atRisk = riskDetectionEngine.getHighRiskStudents(processedData);

            content.innerHTML = `
                <div class="quick-insight-item">
                    <div class="insight-icon">⭐</div>
                    <div class="insight-text">
                        <strong>Top Performer</strong>
                        <p>${topPerformer ? topPerformer.name : 'N/A'} - ${topPerformer ? formatPercentage(topPerformer.averageScore) : 'N/A'}</p>
                    </div>
                </div>
                <div class="quick-insight-item">
                    <div class="insight-icon">⚠️</div>
                    <div class="insight-text">
                        <strong>High Risk Students</strong>
                        <p>${atRisk.length} students need immediate attention</p>
                    </div>
                </div>
                <div class="quick-insight-item">
                    <div class="insight-icon">📈</div>
                    <div class="insight-text">
                        <strong>Average Performance</strong>
                        <p>${formatPercentage(metrics.averageScore)} across all subjects</p>
                    </div>
                </div>
                <div class="quick-insight-item">
                    <div class="insight-icon">✅</div>
                    <div class="insight-text">
                        <strong>Pass Rate</strong>
                        <p>${formatPercentage(metrics.passRate)} of students passing</p>
                    </div>
                </div>
            `;
        } else {
            content.innerHTML = '<p>Upload data to see insights</p>';
        }

        panel.style.display = 'block';
        this.isOpen = true;
    }

    close() {
        const panel = document.getElementById('insightsPanel');
        if (panel) {
            panel.style.display = 'none';
            this.isOpen = false;
        }
    }
}

// Initialize systems
const commandPalette = new CommandPalette();
const notificationSystem = new NotificationSystem();
const tablePagination = new TablePagination();
const quickInsightsPanel = new QuickInsightsPanel();

// Setup command palette input
document.addEventListener('DOMContentLoaded', function() {
    const commandInput = document.getElementById('commandInput');
    if (commandInput) {
        commandInput.addEventListener('input', (e) => {
            commandPalette.updateResults(e.target.value);
        });
        commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const firstItem = document.querySelector('.palette-item.selected');
                if (firstItem) {
                    firstItem.click();
                }
            }
        });
    }

    // Table pagination
    tablePagination.init();

    // Close insights panel
    const closePanel = document.getElementById('closeInsightsPanel');
    if (closePanel) {
        closePanel.addEventListener('click', () => quickInsightsPanel.close());
    }

    // Table action buttons
    const bulkSelectBtn = document.getElementById('bulkSelectBtn');
    const tableExportBtn = document.getElementById('tableExportBtn');
    const tableRefreshBtn = document.getElementById('tableRefreshBtn');

    if (bulkSelectBtn) {
        bulkSelectBtn.addEventListener('click', () => {
            const selectAll = document.getElementById('selectAll');
            if (selectAll) {
                selectAll.checked = !selectAll.checked;
                selectAll.dispatchEvent(new Event('change'));
            }
        });
    }

    if (tableExportBtn) {
        tableExportBtn.addEventListener('click', () => handleExport());
    }

    if (tableRefreshBtn) {
        tableRefreshBtn.addEventListener('click', () => {
            if (typeof updateTable === 'function') {
                updateTable();
                notificationSystem.show('Table refreshed', 'success', 2000);
            }
        });
    }

    // Chart controls
    const fullscreenChart = document.getElementById('fullscreenChart');
    const exportChart = document.getElementById('exportChart');

    if (fullscreenChart) {
        fullscreenChart.addEventListener('click', () => {
            notificationSystem.show('Fullscreen feature coming soon', 'info', 2000);
        });
    }

    if (exportChart) {
        exportChart.addEventListener('click', () => {
            // Export chart as image
            const charts = document.querySelectorAll('canvas');
            if (charts.length > 0) {
                charts.forEach((canvas, index) => {
                    setTimeout(() => {
                        const url = canvas.toDataURL('image/png');
                        const link = document.createElement('a');
                        link.download = `chart-${index + 1}.png`;
                        link.href = url;
                        link.click();
                    }, index * 100);
                });
                notificationSystem.show('Charts exported successfully', 'success', 3000);
            }
        });
    }

    // AI Search button
    const searchAIBtn = document.getElementById('searchAIBtn');
    if (searchAIBtn) {
        searchAIBtn.addEventListener('click', () => {
            if (processedData && processedData.length > 0) {
                const suggestions = generateAISearchSuggestions();
                showAISearchSuggestions(suggestions);
            } else {
                notificationSystem.show('Upload data to get AI search suggestions', 'warning', 2000);
            }
        });
    }

    // Quick insights toggle (Ctrl+I)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            quickInsightsPanel.toggle();
        }
    });
});

/**
 * Generate AI search suggestions
 */
function generateAISearchSuggestions() {
    if (!processedData || processedData.length === 0) return [];

    const metrics = analyticsEngine.getMetrics();
    const suggestions = [];

    // Top performers
    if (metrics.topPerformers && metrics.topPerformers.length > 0) {
        suggestions.push({
            type: 'top',
            label: `Top Performer: ${metrics.topPerformers[0].name}`,
            action: () => {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = metrics.topPerformers[0].name;
                    searchInput.dispatchEvent(new Event('input'));
                }
            }
        });
    }

    // High risk students
    const highRisk = riskDetectionEngine.getHighRiskStudents(processedData);
    if (highRisk.length > 0) {
        suggestions.push({
            type: 'risk',
            label: `${highRisk.length} High Risk Students`,
            action: () => {
                const riskFilter = document.getElementById('riskFilter');
                if (riskFilter) {
                    riskFilter.value = 'high';
                    riskFilter.dispatchEvent(new Event('change'));
                }
            }
        });
    }

    // Worst performing subject
    const subjectStats = metrics.subjectStats || {};
    const worstSubject = Object.entries(subjectStats)
        .sort((a, b) => a[1].averageScore - b[1].averageScore)[0];
    
    if (worstSubject) {
        suggestions.push({
            type: 'subject',
            label: `Lowest: ${worstSubject[0]} (${formatPercentage(worstSubject[1].averageScore)})`,
            action: () => {
                const subjectFilter = document.getElementById('subjectFilter');
                if (subjectFilter) {
                    subjectFilter.value = worstSubject[0];
                    subjectFilter.dispatchEvent(new Event('change'));
                }
            }
        });
    }

    return suggestions;
}

/**
 * Show AI search suggestions
 */
function showAISearchSuggestions(suggestions) {
    if (suggestions.length === 0) {
        notificationSystem.show('No suggestions available', 'info', 2000);
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'ai-suggestions-modal';
    modal.innerHTML = `
        <div class="suggestions-content">
            <div class="suggestions-header">
                <h3>🤖 AI Search Suggestions</h3>
                <button class="suggestions-close">×</button>
            </div>
            <div class="suggestions-list">
                ${suggestions.map((s, i) => `
                    <div class="suggestion-item" data-index="${i}">
                        <span class="suggestion-icon">${s.type === 'top' ? '⭐' : s.type === 'risk' ? '⚠️' : '📚'}</span>
                        <span class="suggestion-label">${s.label}</span>
                        <span class="suggestion-action">→</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add click handlers
    modal.querySelectorAll('.suggestion-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            suggestions[index].action();
            modal.remove();
            notificationSystem.show('Applied suggestion', 'success', 2000);
        });
    });

    modal.querySelector('.suggestions-close').addEventListener('click', () => {
        modal.remove();
    });

    // Animate in
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Make notification system globally accessible
window.notificationSystem = notificationSystem;
window.quickInsightsPanel = quickInsightsPanel;
