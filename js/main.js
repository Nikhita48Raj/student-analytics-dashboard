/**
 * MAIN APPLICATION MODULE
 * Orchestrates all components and handles user interactions
 */

// Global state
let studentData = [];
let processedData = [];

/**
 * Initialize application
 */
function init() {
    initTheme();
    setupFileUpload();
    setupToastClose();
    setupScrollToTop();
    setupEventListeners();
    setupFilterListeners();
}

/**
 * Setup event listeners for all buttons
 */
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
            setTimeout(() => {
                if (typeof visualizationEngine !== 'undefined' && visualizationEngine.updateChartTheme) {
                    visualizationEngine.updateChartTheme();
                }
            }, 100);
        });
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleExport();
        });
    }

    // Print buttons
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handlePrint();
        });
    }

    const printReportBtn = document.getElementById('printReportBtn');
    if (printReportBtn) {
        printReportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handlePrint();
        });
    }

    // Help button
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const helpModal = document.getElementById('helpModal');
            if (helpModal) {
                helpModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Compare button
    const compareBtn = document.getElementById('compareBtn');
    if (compareBtn) {
        compareBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (processedData && processedData.length > 0) {
                const compareModal = document.getElementById('compareModal');
                if (compareModal) {
                    compareModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    setupCompareModal();
                }
            } else {
                showToast('Please upload data first', 'warning');
            }
        });
    }

    // Modal close buttons
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeStudentModal();
        });
    }

    const closeCompareModal = document.getElementById('closeCompareModal');
    if (closeCompareModal) {
        closeCompareModal.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeCompareModalFunc();
        });
    }

    const closeHelpModal = document.getElementById('closeHelpModal');
    if (closeHelpModal) {
        closeHelpModal.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeHelpModalFunc();
        });
    }

    // Close modals on overlay click
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });

    // Clear file button
    const clearFile = document.getElementById('clearFile');
    if (clearFile) {
        clearFile.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleClearFile();
        });
    }

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof filterEngine !== 'undefined') {
                filterEngine.clearFilters();
            }
            const searchInput = document.getElementById('searchInput');
            const subjectFilter = document.getElementById('subjectFilter');
            const semesterFilter = document.getElementById('semesterFilter');
            const riskFilter = document.getElementById('riskFilter');
            const sortSelect = document.getElementById('sortSelect');
            
            if (searchInput) searchInput.value = '';
            if (subjectFilter) subjectFilter.value = '';
            if (semesterFilter) semesterFilter.value = '';
            if (riskFilter) riskFilter.value = '';
            if (sortSelect) sortSelect.value = 'name-asc';
            
            updateTable();
        });
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts();
}

/**
 * Setup filter and search listeners
 */
function setupFilterListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const debouncedSearch = debounce(function(e) {
            if (typeof filterEngine !== 'undefined') {
                filterEngine.setSearch(e.target.value);
                updateTable();
            }
        }, 300);
        searchInput.addEventListener('input', debouncedSearch);
    }

    // Subject filter
    const subjectFilter = document.getElementById('subjectFilter');
    if (subjectFilter) {
        subjectFilter.addEventListener('change', function(e) {
            if (typeof filterEngine !== 'undefined') {
                filterEngine.setSubjectFilter(e.target.value);
                updateTable();
            }
        });
    }

    // Semester filter
    const semesterFilter = document.getElementById('semesterFilter');
    if (semesterFilter) {
        semesterFilter.addEventListener('change', function(e) {
            if (typeof filterEngine !== 'undefined') {
                filterEngine.setSemesterFilter(e.target.value);
                updateTable();
            }
        });
    }

    // Risk filter
    const riskFilter = document.getElementById('riskFilter');
    if (riskFilter) {
        riskFilter.addEventListener('change', function(e) {
            if (typeof filterEngine !== 'undefined') {
                filterEngine.setRiskFilter(e.target.value);
                updateTable();
            }
        });
    }

    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function(e) {
            if (typeof filterEngine !== 'undefined') {
                filterEngine.setSort(e.target.value);
                updateTable();
            }
        });
    }
}

/**
 * Setup file upload functionality
 */
function setupFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const uploadPlaceholder = uploadArea?.querySelector('.upload-placeholder');

    if (!fileInput || !uploadArea) return;

    // Click to browse
    if (uploadPlaceholder) {
        uploadPlaceholder.addEventListener('click', function(e) {
            e.preventDefault();
            fileInput.click();
        });
    }

    // File input change
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });
}

/**
 * Handle file selection
 * @param {File} file - Selected file
 */
async function handleFileSelect(file) {
    if (!validateCSVFile(file)) {
        return;
    }

    showLoading('Reading file...');
    
    try {
        // Update UI
        const fileInfo = document.getElementById('fileInfo');
        const fileName = document.getElementById('fileName');
        if (fileInfo && fileName) {
            fileName.textContent = file.name;
            fileInfo.style.display = 'flex';
        }

        // Parse CSV
        updateLoadingText('Parsing CSV data...');
        await new Promise(resolve => setTimeout(resolve, 300));
        const parsedData = await csvParser.parseFile(file);
        
        // Process data
        updateLoadingText('Analyzing data...');
        await new Promise(resolve => setTimeout(resolve, 300));
        await processData(parsedData);
        
        updateLoadingText('Finalizing...');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        showToast(`Successfully loaded ${parsedData.length} records!`, 'success');
    } catch (error) {
        console.error('Error processing file:', error);
        showToast(error.message || 'Error processing file. Please check the CSV format.', 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Update loading text
 * @param {string} text - Loading text
 */
function updateLoadingText(text) {
    const loadingText = document.getElementById('loadingText');
    if (loadingText) {
        loadingText.textContent = text;
    }
}

/**
 * Process parsed data
 * @param {Array} data - Parsed CSV data
 */
async function processData(data) {
    // Run risk detection
    processedData = riskDetectionEngine.assessAllStudents(data);
    
    // Set data in engines
    analyticsEngine.setData(processedData);
    filterEngine.setData(processedData);
    
    // Update UI
    updateMetrics();
    updateCharts();
    updateFilters();
    updateTable();
    updateInsights();
    
    // Update futuristic features
    if (typeof updateSuccessProbability === 'function') {
        updateSuccessProbability();
    }
    
    // Show AI banner
    if (typeof showAIBanner === 'function') {
        setTimeout(() => {
            showAIBanner('AI analysis complete! Click the AI button for detailed insights.');
        }, 1000);
    }

    // Update pagination
    if (typeof tablePagination !== 'undefined') {
        const filteredData = filterEngine.getFilteredData();
        tablePagination.setTotalItems(filteredData.length);
        tablePagination.currentPage = 1;
    }

    // Show notification
    if (typeof notificationSystem !== 'undefined') {
        notificationSystem.show(`Successfully processed ${data.length} records`, 'success', 3000);
    }
    
    // Show dashboard with smooth transition
    const uploadSection = document.getElementById('uploadSection');
    const dashboardContent = document.getElementById('dashboardContent');
    
    if (uploadSection) {
        uploadSection.style.opacity = '0';
        uploadSection.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            uploadSection.style.display = 'none';
        }, 300);
    }
    
    if (dashboardContent) {
        dashboardContent.style.display = 'block';
        dashboardContent.style.opacity = '0';
        dashboardContent.style.transform = 'translateY(20px)';
        
        // Trigger reflow
        dashboardContent.offsetHeight;
        
        requestAnimationFrame(() => {
            dashboardContent.style.transition = 'all 0.5s ease-out';
            dashboardContent.style.opacity = '1';
            dashboardContent.style.transform = 'translateY(0)';
        });
    }
    
    // Scroll to top smoothly
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 100);
}

/**
 * Update metrics display with animations
 */
function updateMetrics() {
    const metrics = analyticsEngine.getMetrics();
    const atRiskCount = riskDetectionEngine.getAtRiskCount(processedData);

    // Update metric cards with counting animation
    const totalStudentsEl = document.getElementById('totalStudents');
    const averageScoreEl = document.getElementById('averageScore');
    const passRateEl = document.getElementById('passRate');
    const avgAttendanceEl = document.getElementById('avgAttendance');
    const atRiskCountEl = document.getElementById('atRiskCount');

    if (totalStudentsEl) {
        animateValue(totalStudentsEl, 0, metrics.totalStudents, 1000, (val) => formatNumber(Math.round(val)));
    }
    if (averageScoreEl) {
        animateValue(averageScoreEl, 0, metrics.averageScore, 1000, (val) => formatPercentage(val));
    }
    if (passRateEl) {
        animateValue(passRateEl, 0, metrics.passRate, 1000, (val) => formatPercentage(val));
    }
    if (avgAttendanceEl) {
        animateValue(avgAttendanceEl, 0, metrics.averageAttendance, 1000, (val) => formatPercentage(val));
    }
    if (atRiskCountEl) {
        animateValue(atRiskCountEl, 0, atRiskCount, 1000, (val) => formatNumber(Math.round(val)));
    }
}

/**
 * Animate value from start to end
 */
function animateValue(element, start, end, duration, formatter) {
    const startTime = performance.now();
    const range = end - start;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (range * easeOut);
        
        element.textContent = formatter(current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = formatter(end);
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * Update charts
 */
function updateCharts() {
    const metrics = analyticsEngine.getMetrics();
    visualizationEngine.initializeCharts(metrics, processedData);
}

/**
 * Update filter dropdowns
 */
function updateFilters() {
    const subjectFilter = document.getElementById('subjectFilter');
    const semesterFilter = document.getElementById('semesterFilter');

    // Update subject filter
    if (subjectFilter) {
        const currentValue = subjectFilter.value;
        subjectFilter.innerHTML = '<option value="">All Subjects</option>';
        
        const subjects = filterEngine.getUniqueSubjects();
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            if (subject === currentValue) {
                option.selected = true;
            }
            subjectFilter.appendChild(option);
        });
    }

    // Update semester filter
    if (semesterFilter) {
        const currentValue = semesterFilter.value;
        semesterFilter.innerHTML = '<option value="">All Semesters</option>';
        
        const semesters = filterEngine.getUniqueSemesters();
        semesters.forEach(semester => {
            const option = document.createElement('option');
            option.value = semester;
            option.textContent = `Semester ${semester}`;
            if (semester === currentValue) {
                option.selected = true;
            }
            semesterFilter.appendChild(option);
        });
    }
}

/**
 * Update students table
 */
function updateTable() {
    const tableBody = document.getElementById('studentsTableBody');
    const tableCount = document.getElementById('tableCount');
    const tableEmpty = document.getElementById('tableEmpty');
    
    if (!tableBody) return;

    let filteredData = filterEngine.getFilteredData();
    
    // Apply pagination if available
    if (typeof tablePagination !== 'undefined' && tablePagination) {
        tablePagination.setTotalItems(filteredData.length);
        filteredData = tablePagination.getCurrentPageData(filteredData);
    }
    
    // Update count
    if (tableCount) {
        const totalCount = filterEngine.getFilteredData().length;
        tableCount.textContent = formatNumber(totalCount);
    }

    // Show/hide empty state
    if (filteredData.length === 0) {
        if (tableBody) tableBody.style.display = 'none';
        if (tableEmpty) tableEmpty.style.display = 'block';
        return;
    } else {
        if (tableBody) tableBody.style.display = '';
        if (tableEmpty) tableEmpty.style.display = 'none';
    }

    // Clear table
    tableBody.innerHTML = '';

    // Populate table with animation
    filteredData.forEach((student, index) => {
        const row = createTableRow(student);
        row.style.opacity = '0';
        row.style.transform = 'translateY(10px)';
        tableBody.appendChild(row);
        
        // Add click handler for view details button
        const viewBtn = row.querySelector('.view-details-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const studentId = viewBtn.getAttribute('data-student-id');
                if (studentId) {
                    viewStudentDetails(studentId);
                }
            });
        }
        
        // Animate in
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 20);
    });
}

/**
 * Create table row for student
 */
function createTableRow(student) {
    const row = document.createElement('tr');
    
    const trend = analyticsEngine.getStudentTrend(student.studentId);
    const riskBadgeClass = getRiskBadgeClass(student.riskLevel);
    const trendIndicator = getTrendIndicator(trend.trend);

    row.innerHTML = `
        <td class="select-col">
            <input type="checkbox" class="row-checkbox" data-student-id="${student.studentId}">
        </td>
        <td>${student.studentId || 'N/A'}</td>
        <td>${student.name || 'N/A'}</td>
        <td>${student.subject || 'N/A'}</td>
        <td>
            <div class="score-bar-container">
                <span class="score-value">${formatPercentage(student.marks || 0)}</span>
                <div class="score-bar">
                    <div class="score-bar-fill" style="width: ${student.marks || 0}%"></div>
                </div>
            </div>
        </td>
        <td>
            <div class="attendance-indicator">
                <span>${formatPercentage(student.attendance || 0)}</span>
                <div class="attendance-dot ${(student.attendance || 0) >= 75 ? 'good' : (student.attendance || 0) >= 60 ? 'warning' : 'danger'}"></div>
            </div>
        </td>
        <td>${student.semester || 'N/A'}</td>
        <td><span class="risk-badge ${riskBadgeClass}">${student.riskLevel || 'none'}</span></td>
        <td class="trend-cell"></td>
        <td>
            <div class="action-buttons-cell">
                <button class="view-details-btn" data-student-id="${student.studentId}" 
                        aria-label="View details for ${student.name}" title="View Details">
                    👁️
                </button>
            </div>
        </td>
    `;

    // Add trend indicator to the cell
    const trendCell = row.querySelector('.trend-cell');
    if (trendCell && trendIndicator) {
        trendCell.appendChild(trendIndicator);
    }

    return row;
}

/**
 * View student details in modal
 */
function viewStudentDetails(studentId) {
    if (!studentId) return;
    
    const student = processedData.find(s => s.studentId === studentId);
    if (!student) {
        showToast('Student not found', 'error');
        return;
    }

    const modal = document.getElementById('studentModal');
    const modalName = document.getElementById('modalStudentName');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalName || !modalContent) return;

    // Get all records for this student
    const studentRecords = processedData.filter(s => s.studentId === studentId);
    const trend = analyticsEngine.getStudentTrend(studentId);
    const avgScore = studentRecords.reduce((sum, r) => sum + (r.marks || 0), 0) / studentRecords.length;
    const avgAttendance = studentRecords.reduce((sum, r) => sum + (r.attendance || 0), 0) / studentRecords.length;

    modalName.textContent = student.name || studentId;
    
    modalContent.innerHTML = `
        <div class="student-detail-grid">
            <div class="detail-card">
                <div class="detail-label">Student ID</div>
                <div class="detail-value">${student.studentId}</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Average Score</div>
                <div class="detail-value">${formatPercentage(avgScore)}</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Average Attendance</div>
                <div class="detail-value">${formatPercentage(avgAttendance)}</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Risk Level</div>
                <div class="detail-value">
                    <span class="risk-badge ${getRiskBadgeClass(student.riskLevel)}">${student.riskLevel}</span>
                </div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Risk Score</div>
                <div class="detail-value">${student.riskScore || 0}%</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Performance Trend</div>
                <div class="detail-value">${getTrendIndicator(trend.trend).outerHTML || '<span>➡️</span>'}</div>
            </div>
        </div>

        <div class="detail-section">
            <h3>📚 Subject Performance</h3>
            <div class="table-container">
                <table class="students-table">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Score</th>
                            <th>Attendance</th>
                            <th>Semester</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${studentRecords.map(record => `
                            <tr>
                                <td>${record.subject || 'N/A'}</td>
                                <td>${formatPercentage(record.marks || 0)}</td>
                                <td>${formatPercentage(record.attendance || 0)}</td>
                                <td>${record.semester || 'N/A'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        ${student.riskFactors && student.riskFactors.length > 0 ? `
        <div class="detail-section">
            <h3>⚠️ Risk Factors</h3>
            <ul class="risk-factors-list">
                ${student.riskFactors.map(factor => `<li>${factor}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Update insights section
 */
function updateInsights() {
    const insightsContainer = document.getElementById('insightsContainer');
    if (!insightsContainer) return;

    const analyticsInsights = analyticsEngine.generateInsights();
    const riskInsights = riskDetectionEngine.getRiskInsights(processedData);
    const allInsights = [...analyticsInsights, ...riskInsights];

    insightsContainer.innerHTML = '';

    if (allInsights.length === 0) {
        insightsContainer.innerHTML = '<p style="color: var(--text-secondary);">No insights available.</p>';
        return;
    }

    allInsights.forEach(insight => {
        const card = document.createElement('div');
        card.className = `insight-card ${insight.type}`;
        card.innerHTML = `
            <div class="insight-header">
                <span class="insight-icon">${insight.icon}</span>
                <h3 class="insight-title">${insight.title}</h3>
            </div>
            <p class="insight-content">${insight.content}</p>
        `;
        insightsContainer.appendChild(card);
    });
}

/**
 * Handle export
 */
function handleExport() {
    if (!processedData || processedData.length === 0) {
        showToast('No data to export. Please upload a file first.', 'warning');
        return;
    }

    const filteredData = filterEngine.getFilteredData();
    
    if (filteredData.length === 0) {
        showToast('No data matches current filters.', 'warning');
        return;
    }
    
    // Prepare export data
    const exportData = filteredData.map(student => ({
        'Student ID': student.studentId,
        'Name': student.name,
        'Subject': student.subject,
        'Marks': student.marks,
        'Attendance': student.attendance,
        'Semester': student.semester,
        'Risk Level': student.riskLevel,
        'Risk Score': student.riskScore
    }));

    downloadCSV(exportData, 'student-analytics-export.csv');
}

/**
 * Handle clear file
 */
function handleClearFile() {
    // Clear file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.value = '';
    }

    // Hide file info
    const fileInfo = document.getElementById('fileInfo');
    if (fileInfo) {
        fileInfo.style.display = 'none';
    }

    // Reset data
    studentData = [];
    processedData = [];
    csvParser.clear();
    analyticsEngine.setData([]);
    filterEngine.setData([]);

    // Show upload section, hide dashboard
    const uploadSection = document.getElementById('uploadSection');
    const dashboardContent = document.getElementById('dashboardContent');
    
    if (uploadSection) {
        uploadSection.style.display = 'block';
        uploadSection.style.opacity = '1';
        uploadSection.style.transform = 'translateY(0)';
    }
    if (dashboardContent) {
        dashboardContent.style.display = 'none';
    }

    // Destroy charts
    visualizationEngine.destroyAllCharts();
    
    showToast('Data cleared', 'success');
}

/**
 * Setup toast close button
 */
function setupToastClose() {
    const toastClose = document.querySelector('.toast-close');
    if (toastClose) {
        toastClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeToast();
        });
    }
}

/**
 * Handle print functionality
 */
function handlePrint() {
    if (!processedData || processedData.length === 0) {
        showToast('No data to print. Please upload a file first.', 'warning');
        return;
    }
    window.print();
}

/**
 * Close student modal
 */
function closeStudentModal() {
    const modal = document.getElementById('studentModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Close compare modal
 */
function closeCompareModalFunc() {
    const modal = document.getElementById('compareModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Close help modal
 */
function closeHelpModalFunc() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Close all modals
 */
function closeAllModals() {
    closeStudentModal();
    closeCompareModalFunc();
    closeHelpModalFunc();
}

/**
 * Setup compare modal
 */
function setupCompareModal() {
    const compareStudent1 = document.getElementById('compareStudent1');
    const compareStudent2 = document.getElementById('compareStudent2');
    const compareResults = document.getElementById('compareResults');
    
    if (!compareStudent1 || !compareStudent2) return;

    // Get unique students
    const uniqueStudents = Array.from(
        new Map(processedData.map(s => [s.studentId, s])).values()
    );

    // Populate dropdowns
    compareStudent1.innerHTML = '<option value="">Select First Student</option>';
    compareStudent2.innerHTML = '<option value="">Select Second Student</option>';
    
    uniqueStudents.forEach(student => {
        const option1 = document.createElement('option');
        option1.value = student.studentId;
        option1.textContent = `${student.name} (${student.studentId})`;
        compareStudent1.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = student.studentId;
        option2.textContent = `${student.name} (${student.studentId})`;
        compareStudent2.appendChild(option2);
    });

    // Create comparison function
    const performComparison = function() {
        const id1 = compareStudent1.value;
        const id2 = compareStudent2.value;

        if (!id1 || !id2) {
            if (compareResults) {
                compareResults.style.display = 'none';
                compareResults.innerHTML = '';
            }
            return;
        }

        if (id1 === id2) {
            if (typeof showToast === 'function') {
                showToast('Please select two different students', 'warning');
            }
            if (compareResults) {
                compareResults.style.display = 'none';
            }
            return;
        }

        const student1 = uniqueStudents.find(s => s.studentId === id1);
        const student2 = uniqueStudents.find(s => s.studentId === id2);

        if (!student1 || !student2) {
            if (typeof showToast === 'function') {
                showToast('Student not found', 'error');
            }
            return;
        }

        // Get all records for each student
        const records1 = processedData.filter(s => s.studentId === id1);
        const records2 = processedData.filter(s => s.studentId === id2);

        if (records1.length === 0 || records2.length === 0) {
            if (typeof showToast === 'function') {
                showToast('Insufficient data for comparison', 'warning');
            }
            return;
        }

        const avgScore1 = records1.reduce((sum, r) => sum + (r.marks || 0), 0) / records1.length;
        const avgScore2 = records2.reduce((sum, r) => sum + (r.marks || 0), 0) / records2.length;
        const avgAtt1 = records1.reduce((sum, r) => sum + (r.attendance || 0), 0) / records1.length;
        const avgAtt2 = records2.reduce((sum, r) => sum + (r.attendance || 0), 0) / records2.length;

        // Get risk assessment for each student
        const risk1 = riskDetectionEngine.assessStudent(records1[0]);
        const risk2 = riskDetectionEngine.assessStudent(records2[0]);

        const trend1 = analyticsEngine.getStudentTrend(id1);
        const trend2 = analyticsEngine.getStudentTrend(id2);

        // Calculate differences
        const scoreDiff = avgScore1 - avgScore2;
        const attDiff = avgAtt1 - avgAtt2;

        if (compareResults) {
            compareResults.style.display = 'block';
            compareResults.innerHTML = `
                <div class="compare-header-info">
                    <p class="compare-subtitle">Side-by-Side Performance Comparison</p>
                </div>
                <div class="compare-students-container">
                    <div class="compare-student futuristic-card">
                        <div class="compare-student-header">
                            <h3>${student1.name || student1.studentId}</h3>
                            <span class="student-id-badge">${student1.studentId}</span>
                        </div>
                        <div class="compare-metrics-grid">
                            <div class="compare-metric">
                                <span class="metric-label-compare">Average Score</span>
                                <strong class="metric-value-compare ${scoreDiff >= 0 ? 'better' : 'worse'}">${formatPercentage(avgScore1)}</strong>
                                ${scoreDiff !== 0 ? `<span class="metric-diff ${scoreDiff >= 0 ? 'positive' : 'negative'}">${scoreDiff >= 0 ? '+' : ''}${formatPercentage(Math.abs(scoreDiff))}</span>` : ''}
                            </div>
                            <div class="compare-metric">
                                <span class="metric-label-compare">Average Attendance</span>
                                <strong class="metric-value-compare ${attDiff >= 0 ? 'better' : 'worse'}">${formatPercentage(avgAtt1)}</strong>
                                ${attDiff !== 0 ? `<span class="metric-diff ${attDiff >= 0 ? 'positive' : 'negative'}">${attDiff >= 0 ? '+' : ''}${formatPercentage(Math.abs(attDiff))}</span>` : ''}
                            </div>
                            <div class="compare-metric">
                                <span class="metric-label-compare">Risk Level</span>
                                <span class="risk-badge ${getRiskBadgeClass(risk1.riskLevel)}">${risk1.riskLevel}</span>
                            </div>
                            <div class="compare-metric">
                                <span class="metric-label-compare">Risk Score</span>
                                <strong>${risk1.riskScore || 0}%</strong>
                            </div>
                            <div class="compare-metric">
                                <span class="metric-label-compare">Performance Trend</span>
                                <div class="trend-display">${getTrendIndicator(trend1.trend).outerHTML || '<span>➡️</span>'}</div>
                            </div>
                            <div class="compare-metric">
                                <span class="metric-label-compare">Total Records</span>
                                <strong>${records1.length}</strong>
                            </div>
                            ${risk1.factors && risk1.factors.length > 0 ? `
                            <div class="compare-metric full-width">
                                <span class="metric-label-compare">Risk Factors</span>
                                <div class="risk-factors-compare">
                                    ${risk1.factors.map(f => `<span class="risk-factor-tag">${f}</span>`).join('')}
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="compare-vs-divider">
                        <div class="vs-circle">VS</div>
                    </div>
                    <div class="compare-student futuristic-card">
                        <div class="compare-student-header">
                            <h3>${student2.name || student2.studentId}</h3>
                            <span class="student-id-badge">${student2.studentId}</span>
                        </div>
                        <div class="compare-metrics-grid">
                            <div class="compare-metric">
                                <span class="metric-label-compare">Average Score</span>
                                <strong class="metric-value-compare ${scoreDiff <= 0 ? 'better' : 'worse'}">${formatPercentage(avgScore2)}</strong>
                                ${scoreDiff !== 0 ? `<span class="metric-diff ${scoreDiff <= 0 ? 'positive' : 'negative'}">${scoreDiff <= 0 ? '+' : ''}${formatPercentage(Math.abs(scoreDiff))}</span>` : ''}
                            </div>
                            <div class="compare-metric">
                                <span class="metric-label-compare">Average Attendance</span>
                                <strong class="metric-value-compare ${attDiff <= 0 ? 'better' : 'worse'}">${formatPercentage(avgAtt2)}</strong>
                                ${attDiff !== 0 ? `<span class="metric-diff ${attDiff <= 0 ? 'positive' : 'negative'}">${attDiff <= 0 ? '+' : ''}${formatPercentage(Math.abs(attDiff))}</span>` : ''}
                            </div>
                            <div class="compare-metric">
                                <span class="metric-label-compare">Risk Level</span>
                                <span class="risk-badge ${getRiskBadgeClass(risk2.riskLevel)}">${risk2.riskLevel}</span>
                            </div>
                            <div class="compare-metric">
                                <span class="metric-label-compare">Risk Score</span>
                                <strong>${risk2.riskScore || 0}%</strong>
                            </div>
                            <div class="compare-metric">
                                <span class="metric-label-compare">Performance Trend</span>
                                <div class="trend-display">${getTrendIndicator(trend2.trend).outerHTML || '<span>➡️</span>'}</div>
                            </div>
                            <div class="compare-metric">
                                <span class="metric-label-compare">Total Records</span>
                                <strong>${records2.length}</strong>
                            </div>
                            ${risk2.factors && risk2.factors.length > 0 ? `
                            <div class="compare-metric full-width">
                                <span class="metric-label-compare">Risk Factors</span>
                                <div class="risk-factors-compare">
                                    ${risk2.factors.map(f => `<span class="risk-factor-tag">${f}</span>`).join('')}
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                <div class="compare-summary">
                    <h4>📊 Comparison Summary</h4>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <span class="summary-label">Score Difference</span>
                            <span class="summary-value ${Math.abs(scoreDiff) > 10 ? 'significant' : ''}">${formatPercentage(Math.abs(scoreDiff))}</span>
                            <span class="summary-winner">${scoreDiff > 0 ? (student1.name || student1.studentId) : (student2.name || student2.studentId)} leads</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Attendance Difference</span>
                            <span class="summary-value ${Math.abs(attDiff) > 10 ? 'significant' : ''}">${formatPercentage(Math.abs(attDiff))}</span>
                            <span class="summary-winner">${attDiff > 0 ? (student1.name || student1.studentId) : (student2.name || student2.studentId)} leads</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Animate results in
            setTimeout(() => {
                compareResults.style.opacity = '0';
                compareResults.style.transform = 'translateY(20px)';
                compareResults.style.transition = 'all 0.5s ease-out';
                setTimeout(() => {
                    compareResults.style.opacity = '1';
                    compareResults.style.transform = 'translateY(0)';
                }, 10);
            }, 10);
        }
    };

    // Store listener reference to prevent duplicates
    if (compareStudent1._compareListener) {
        compareStudent1.removeEventListener('change', compareStudent1._compareListener);
    }
    if (compareStudent2._compareListener) {
        compareStudent2.removeEventListener('change', compareStudent2._compareListener);
    }

    // Store the listener function
    compareStudent1._compareListener = performComparison;
    compareStudent2._compareListener = performComparison;

    // Add event listeners
    compareStudent1.addEventListener('change', performComparison);
    compareStudent2.addEventListener('change', performComparison);

    // Show helpful message
    if (typeof notificationSystem !== 'undefined') {
        notificationSystem.show('Select two students from the dropdowns to compare', 'info', 3000);
    }
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl+P or Cmd+P: Print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            handlePrint();
        }

        // T: Toggle theme
        if (e.key === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const activeElement = document.activeElement;
            if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                toggleTheme();
                setTimeout(() => {
                    if (typeof visualizationEngine !== 'undefined' && visualizationEngine.updateChartTheme) {
                        visualizationEngine.updateChartTheme();
                    }
                }, 100);
            }
        }

        // ?: Help
        if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
            const activeElement = document.activeElement;
            if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                const helpModal = document.getElementById('helpModal');
                if (helpModal) {
                    helpModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            }
        }

        // Esc: Close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }

        // Ctrl+F or Cmd+F: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            const activeElement = document.activeElement;
            if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
        }
    });
}

/**
 * Setup scroll to top button
 */
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });

    scrollBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Make viewStudentDetails globally accessible
window.viewStudentDetails = viewStudentDetails;

// Ensure all futuristic features are initialized
function initializeAllFeatures() {
    // Wait for all scripts to load
    if (typeof setupFuturisticFeatures === 'function') {
        setupFuturisticFeatures();
    }
    
    // Initialize advanced features if available
    if (typeof commandPalette !== 'undefined') {
        // Already initialized in advanced-features.js
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        init();
        setTimeout(initializeAllFeatures, 100);
    });
} else {
    // DOM is already ready
    init();
    setTimeout(initializeAllFeatures, 100);
}
