const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Set up destination for uploaded files
const upload = multer({ dest: 'uploads/' });

// In-memory data store for the dashboard
let dashboardData = [];

// Helper function to calculate analytics
const calculateAnalytics = (data) => {
  const totalStudents = data.length;
  if (totalStudents === 0) return null;

  const totalScore = data.reduce((sum, s) => sum + (Number(s.marks) || 0), 0);
  const averageScore = totalScore / totalStudents;

  const passCount = data.filter(s => (Number(s.marks) || 0) >= 50).length;
  const passRate = (passCount / totalStudents) * 100;

  const totalAttendance = data.reduce((sum, s) => sum + (Number(s.attendance) || 0), 0);
  const averageAttendance = totalAttendance / totalStudents;

  const atRiskCount = data.filter(student => {
    const marks = Number(student.marks) || 0;
    const attendance = Number(student.attendance) || 0;
    // Basic risk logic (marks < 40 or attendance < 60)
    let riskScore = 0;
    if (marks < 40) riskScore += 0.4;
    else if (marks < 50) riskScore += 0.2;
    if (attendance < 60) riskScore += 0.3;
    return riskScore >= 0.4; 
  }).length;

  return {
    totalStudents,
    averageScore: averageScore.toFixed(1),
    passRate: passRate.toFixed(1),
    averageAttendance: averageAttendance.toFixed(1),
    atRiskCount
  };
};

// Endpoint: Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Endpoint: Upload CSV
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      // Clean data
      const id = data['Student ID'] || data['ID'] || data.studentId || `STU-${Math.floor(Math.random() * 10000)}`;
      
      const parsedMarks = parseFloat(data['Marks'] || data['Score'] || data['Grade']);
      const parsedAttendance = parseFloat(data['Attendance'] || data['Attendance Percentage']);

      results.push({
        id: id,
        name: data['Name'] || data['Student Name'] || `Student ${id}`,
        subject: data['Subject'] || data['Course'] || 'General',
        marks: isNaN(parsedMarks) ? 0 : Math.max(0, Math.min(100, parsedMarks)),
        attendance: isNaN(parsedAttendance) ? 0 : Math.max(0, Math.min(100, parsedAttendance)),
        semester: data['Semester'] || data['Term'] || '1',
        assessmentType: data['Assessment Type'] || data['Assessment'] || 'Exam'
      });
    })
    .on('end', () => {
      // Save to memory
      dashboardData = results;
      
      // Cleanup uploaded file
      fs.unlink(filePath, (err) => {
        if (err) console.error("Could not delete uploaded file:", err);
      });

      const analytics = calculateAnalytics(dashboardData);
      
      res.json({ 
        message: 'File processed successfully', 
        count: dashboardData.length,
        analytics 
      });
    })
    .on('error', (err) => {
      res.status(500).json({ error: 'Failed to process CSV file' });
    });
});

// Endpoint: Get Students Data
app.get('/api/students', (req, res) => {
  res.json({ data: dashboardData });
});

// Endpoint: Get Analytics
app.get('/api/analytics', (req, res) => {
  const analytics = calculateAnalytics(dashboardData);
  res.json({ analytics });
});

// Endpoint: Update Student (PUT)
app.put('/api/students/:id', (req, res) => {
  const studentId = req.params.id;
  const updateData = req.body;
  
  const index = dashboardData.findIndex(s => s.id === studentId);
  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  dashboardData[index] = { ...dashboardData[index], ...updateData };
  const analytics = calculateAnalytics(dashboardData);
  
  res.json({ message: 'Student updated successfully', student: dashboardData[index], analytics });
});

// Endpoint: Delete Student (DELETE)
app.delete('/api/students/:id', (req, res) => {
  const studentId = req.params.id;
  const initialLength = dashboardData.length;
  
  dashboardData = dashboardData.filter(s => s.id !== studentId);
  
  if (dashboardData.length === initialLength) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  const analytics = calculateAnalytics(dashboardData);
  res.json({ message: 'Student deleted successfully', analytics });
});

// Endpoint: Get Recent Activity
app.get('/api/activity', (req, res) => {
  res.json([
    { id: 1, text: "System ready. Awaiting data upload.", time: new Date().toISOString() },
    { id: 2, text: `Active student records: ${dashboardData.length}`, time: new Date().toISOString() }
  ]);
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
