/**
 * CSV PARSER MODULE
 * Handles CSV file upload, parsing, validation, and data transformation
 */

class CSVParser {
    constructor() {
        this.rawData = [];
        this.parsedData = [];
        this.errors = [];
    }

    /**
     * Parse CSV file
     * @param {File} file - CSV file to parse
     * @returns {Promise<Array>} Parsed data array
     */
    async parseFile(file) {
        return new Promise((resolve, reject) => {
            if (!validateCSVFile(file)) {
                reject(new Error('Invalid CSV file'));
                return;
            }

            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const csv = e.target.result;
                    const parsed = this.parseCSV(csv);
                    
                    if (parsed.length === 0) {
                        reject(new Error('CSV file is empty or invalid'));
                        return;
                    }
                    
                    this.parsedData = parsed;
                    resolve(parsed);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Error reading file'));
            };
            
            reader.readAsText(file);
        });
    }

    /**
     * Parse CSV string into array of objects
     * @param {string} csv - CSV string content
     * @returns {Array} Parsed data array
     */
    parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV must have at least a header row and one data row');
        }

        // Parse header
        const headers = this.parseCSVLine(lines[0]);
        const normalizedHeaders = headers.map(h => this.normalizeHeader(h));

        // Parse data rows
        const data = [];
        this.errors = [];

        for (let i = 1; i < lines.length; i++) {
            try {
                const values = this.parseCSVLine(lines[i]);
                
                if (values.length !== normalizedHeaders.length) {
                    this.errors.push(`Row ${i + 1}: Column count mismatch`);
                    continue;
                }

                const row = {};
                normalizedHeaders.forEach((header, index) => {
                    row[header] = this.cleanValue(values[index]);
                });

                // Validate and transform row
                const validatedRow = this.validateAndTransformRow(row, i + 1);
                if (validatedRow) {
                    data.push(validatedRow);
                }
            } catch (error) {
                this.errors.push(`Row ${i + 1}: ${error.message}`);
            }
        }

        if (this.errors.length > 0 && data.length === 0) {
            throw new Error(`Failed to parse CSV: ${this.errors.join('; ')}`);
        }

        return data;
    }

    /**
     * Parse a single CSV line handling quoted values
     * @param {string} line - CSV line
     * @returns {Array} Array of values
     */
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());

        return values;
    }

    /**
     * Normalize header names to standard format
     * @param {string} header - Original header
     * @returns {string} Normalized header
     */
    normalizeHeader(header) {
        const normalized = header.trim().toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
        
        // Map common variations
        const headerMap = {
            'student_id': 'studentId',
            'id': 'studentId',
            'studentid': 'studentId',
            'name': 'name',
            'student_name': 'name',
            'full_name': 'name',
            'subject': 'subject',
            'course': 'subject',
            'marks': 'marks',
            'score': 'marks',
            'grade': 'marks',
            'attendance': 'attendance',
            'attendance_percentage': 'attendance',
            'semester': 'semester',
            'term': 'semester',
            'assessment_type': 'assessmentType',
            'assessment': 'assessmentType',
            'type': 'assessmentType'
        };

        return headerMap[normalized] || normalized;
    }

    /**
     * Clean and convert value
     * @param {string} value - Raw value
     * @returns {any} Cleaned value
     */
    cleanValue(value) {
        if (!value || value.trim() === '') return null;
        
        // Remove quotes if present
        value = value.replace(/^"|"$/g, '');
        
        // Try to parse as number
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && isFinite(numValue)) {
            return numValue;
        }
        
        return value.trim();
    }

    /**
     * Validate and transform row data
     * @param {Object} row - Raw row object
     * @param {number} rowNumber - Row number for error reporting
     * @returns {Object|null} Validated row or null if invalid
     */
    validateAndTransformRow(row, rowNumber) {
        // Ensure required fields exist
        if (!row.studentId && !row.name) {
            this.errors.push(`Row ${rowNumber}: Missing student ID or name`);
            return null;
        }

        // Generate studentId if missing
        if (!row.studentId) {
            row.studentId = `STU-${rowNumber}`;
        }

        // Ensure name exists
        if (!row.name) {
            row.name = `Student ${row.studentId}`;
        }

        // Normalize marks/score
        if (row.marks === null || row.marks === undefined) {
            row.marks = 0;
        } else {
            row.marks = parseFloat(row.marks);
            if (isNaN(row.marks)) {
                row.marks = 0;
            }
            // Clamp marks between 0 and 100
            row.marks = Math.max(0, Math.min(100, row.marks));
        }

        // Normalize attendance
        if (row.attendance === null || row.attendance === undefined) {
            row.attendance = 0;
        } else {
            row.attendance = parseFloat(row.attendance);
            if (isNaN(row.attendance)) {
                row.attendance = 0;
            }
            // Clamp attendance between 0 and 100
            row.attendance = Math.max(0, Math.min(100, row.attendance));
        }

        // Set default subject if missing
        if (!row.subject) {
            row.subject = 'General';
        }

        // Set default semester if missing
        if (!row.semester) {
            row.semester = '1';
        }

        // Set default assessment type if missing
        if (!row.assessmentType) {
            row.assessmentType = 'Exam';
        }

        // Add unique row ID
        row.rowId = `${row.studentId}-${row.subject}-${row.semester}-${Date.now()}`;

        return row;
    }

    /**
     * Get parsing errors
     * @returns {Array} Array of error messages
     */
    getErrors() {
        return this.errors;
    }

    /**
     * Get parsed data
     * @returns {Array} Parsed data array
     */
    getData() {
        return this.parsedData;
    }

    /**
     * Clear parsed data
     */
    clear() {
        this.rawData = [];
        this.parsedData = [];
        this.errors = [];
    }
}

// Export singleton instance
const csvParser = new CSVParser();
