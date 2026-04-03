const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = 'super_secret_sis_nexus_key_2026';

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// In-memory data stores
let dashboardData = [];
let uploadHistory = [];
let auditLogs = [
  { id: 1, timestamp: new Date().toISOString(), user: 'System', role: 'System', action: 'System Initialized', target: 'Server' }
];

let systemSettings = {
  riskThresholdMarks: 40,
  riskThresholdAttendance: 60,
  features: {
    advancedAnalytics: true,
  }
};

// Mock Users
let users = [
  { id: 1, username: 'admin', password: 'password', role: 'Admin', name: 'Admin User' },
  { id: 2, username: 'teacher', password: 'password', role: 'Teacher', name: 'Mrs. Teacher', assignedSubject: 'Mathematics' },
  { id: 3, username: 'student', password: 'password', role: 'Student', name: 'Student 1', linkedStudentId: 'STU-001-Mathematics-2' }
];

// Custom log function
const logAction = (user, role, action, target) => {
  auditLogs.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    user,
    role,
    action,
    target
  });
};

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    // find fresh user info (in case of updates)
    const freshUser = users.find(u => u.id === user.id);
    if (!freshUser) return res.status(403).json({ error: 'User no longer exists' });
    req.user = freshUser;
    next();
  });
};

// --- ENDPOINTS ---
const attachRiskLevels = (data) => {
  return data.map(student => {
    const marks = Number(student.marks) || 0;
    const attendance = Number(student.attendance) || 0;
    let riskScore = 0;
    
    // Use systemSettings for risk bounds
    if (marks < systemSettings.riskThresholdMarks) riskScore += 0.4;
    else if (marks < systemSettings.riskThresholdMarks + 10) riskScore += 0.2;
    if (attendance < systemSettings.riskThresholdAttendance) riskScore += 0.3;
    
    let riskObj = { level: 'No Risk', class: 'risk-none', id: 'none' };
    if (riskScore >= 0.7) riskObj = { level: 'High Risk', class: 'risk-high', id: 'high' };
    else if (riskScore >= 0.4) riskObj = { level: 'Medium Risk', class: 'risk-medium', id: 'medium' };
    else if (riskScore >= 0.2) riskObj = { level: 'Low Risk', class: 'risk-low', id: 'low' };

    return { ...student, riskLevel: riskObj };
  });
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  let user = users.find(u => u.username === username && u.password === password);

  // Dynamic Test Fallback
  if (!user && password === 'password') {
    console.log('Fallback triggered for:', username);
    console.log('Dashboard Data size:', dashboardData.length);
    if (!username) return res.status(401).json({ error: 'No username string' });
    
    const targetTarget = dashboardData.find(s => {
       const hasId = Boolean(s.id && typeof s.id === 'string' && s.id.toLowerCase().includes(username.toLowerCase()));
       const hasName = Boolean(s.name && typeof s.name === 'string' && s.name.toLowerCase().includes(username.toLowerCase()));
       return hasId || hasName;
    });

    console.log('Target found?:', targetTarget ? targetTarget.name : 'No');

    if (targetTarget) {
       user = { 
         id: Date.now(), 
         username: username, 
         password: 'password', 
         role: 'Student', 
         name: targetTarget.name, 
         linkedStudentId: targetTarget.id 
       };
       users.push(user);
    }
  }

  if (!user) {
     return res.status(401).json({ 
       error: 'Invalid credentials', 
       debug: { 
         usernamePassed: username, 
         dataSize: dashboardData.length,
         typeOfFirst: dashboardData.length > 0 ? typeof dashboardData[0].name : 'none'
       } 
     });
  }
  
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '12h' });
  logAction(user.name, user.role, 'User Login', 'Auth System');
  res.json({ token, user: { id: user.id, username: user.username, role: user.role, name: user.name, assignedSubject: user.assignedSubject, linkedStudentId: user.linkedStudentId } });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Calculate core derived metrics system
const calculateAnalytics = (data, userRole) => {
  const totalStudents = data.length;
  if (totalStudents === 0) return null;

  const totalScore = data.reduce((sum, s) => sum + (Number(s.marks) || 0), 0);
  const averageScore = totalScore / totalStudents;
  const passCount = data.filter(s => (Number(s.marks) || 0) >= 50).length;
  const passRate = (passCount / totalStudents) * 100;
  const totalAttendance = data.reduce((sum, s) => sum + (Number(s.attendance) || 0), 0);
  const averageAttendance = totalAttendance / totalStudents;

  const atRiskStudents = data.filter(s => (Number(s.marks) || 0) < systemSettings.riskThresholdMarks || (Number(s.attendance) || 0) < systemSettings.riskThresholdAttendance);
  const atRiskCount = atRiskStudents.length;

  let extraData = {};
  
  if (userRole === 'Admin') {
     const subjects = [...new Set(data.map(s => s.subject))];
     const subjectAverages = subjects.map(sub => {
       const subData = data.filter(s => s.subject === sub);
       return { subject: sub, avg: subData.reduce((s, curr) => s + curr.marks, 0) / subData.length };
     });
     subjectAverages.sort((a,b) => a.avg - b.avg);

     const batches = [...new Set(data.map(s => s.semester))];
     const batchAverages = batches.map(b => {
        const bData = data.filter(s => s.semester === b);
        return { batch: b, avg: bData.reduce((s, curr) => s + curr.marks, 0) / bData.length };
     });
     batchAverages.sort((a,b) => b.avg - a.avg);

     extraData = {
        top5AtRisk: atRiskStudents.sort((a, b) => a.marks - b.marks).slice(0, 5).map(s => ({...s, explain: s.attendance < 60 ? 'Low Attendance' : 'Low Marks'})),
        worstSubjects: subjectAverages.slice(0, 3),
        bestBatch: batchAverages.length > 0 ? batchAverages[0] : null,
     };
  }

  return {
    totalStudents,
    averageScore: averageScore.toFixed(1),
    passRate: passRate.toFixed(1),
    averageAttendance: averageAttendance.toFixed(1),
    atRiskCount,
    ...extraData
  };
};

app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Permission denied. Admins only.' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const results = [];
  const filePath = req.file.path;
  let missingValues = 0;
  let duplicatesCount = 0;
  const existingIds = new Set(dashboardData.map(s => s.id));

  fs.createReadStream(filePath)
    .pipe(csv({ mapHeaders: ({ header }) => header.trim().replace(/^[\uFEFF]/, '') }))
    .on('data', (data) => {
      const rawId = data['Student ID'] || data['StudentID'] || data['ID'] || data.studentId || `STU-${Math.floor(Math.random() * 10000)}`;
      const subjectField = data['Subject'] || data['Course'] || 'General';
      const semesterField = data['Semester'] || data['Term'] || '1';
      const id = `${rawId}-${subjectField}-${semesterField}`.replace(/\s+/g, '-');
      
      if (existingIds.has(id)) duplicatesCount++;
      if (!data['Subject'] || !data['Marks']) missingValues++;

      const marks = parseFloat(data['Marks'] || data['Score'] || data['Grade']) || 0;
      const attendance = parseFloat(data['Attendance'] || data['Attendance Percentage']) || 0;
      
      const term1 = Math.max(0, Math.min(100, marks + (Math.random() * 20 - 10)));
      const term2 = Math.max(0, Math.min(100, marks + (Math.random() * 15 - 5)));
      const term3 = Math.max(0, Math.min(100, marks + (Math.random() * 10 - 2)));
      const pastScores = [term1, term2, term3];
      
      const gpa = (marks / 10).toFixed(2);
      const averagePast = pastScores.reduce((a, b) => a + b, 0) / pastScores.length;
      
      let trend = 'Stable';
      if (marks > averagePast + 5) trend = 'Improving';
      if (marks < averagePast - 5) trend = 'Declining';

      let anomaly = false;
      let insights = [];
      if (marks < 40 && attendance > 90) {
         anomaly = true;
         insights.push("Anomaly: Exceptionally high attendance but critically low marks.");
      }
      if (trend === 'Declining' && attendance < 60) {
         insights.push("Risk: Declining trend heavily correlated with poor attendance.");
      }
      if (marks >= 85 && trend === 'Improving') {
         insights.push("Positive: Student is excelling and showing an upward trajectory.");
      }

      const remarks = data['Remarks'] || '';

      results.push({
        id,
        name: data['Name'] || data['Student Name'] || `Student ${id}`,
        subject: data['Subject'] || data['Course'] || 'General',
        marks: Math.max(0, Math.min(100, marks)),
        attendance: Math.max(0, Math.min(100, attendance)),
        semester: data['Semester'] || data['Term'] || '1',
        assessmentType: data['Assessment Type'] || data['Assessment'] || 'Exam',
        gpa,
        pastScores,
        trend,
        consistencyScore: (100 - Math.abs(averagePast - marks)).toFixed(1),
        anomaly,
        insights,
        remarks
      });
    })
    .on('end', () => {
      // Create backup
      const uploadId = Date.now().toString();
      uploadHistory.push({
        id: uploadId,
        timestamp: new Date().toISOString(),
        previousData: [...dashboardData],
        insertedRecords: results.length,
        uploader: req.user.name,
        health: {
          missingValues,
          duplicatesCount,
          validPercentage: ((results.length - missingValues) / results.length * 100).toFixed(1)
        }
      });

      // Upsert logic to handle duplicates cleanly
      results.forEach(resItem => {
         const index = dashboardData.findIndex(s => s.id === resItem.id || (s.name === resItem.name && s.subject === resItem.subject));
         if (index !== -1) {
             // Retain the original ID to prevent reference breaks
             dashboardData[index] = { ...dashboardData[index], ...resItem, id: dashboardData[index].id };
         } else {
             dashboardData.push(resItem);
         }
      });
      
      fs.unlink(filePath, () => {});
      
      logAction(req.user.name, req.user.role, 'CSV Dataset Uploaded', `Upload ID: ${uploadId}`);
      const analytics = calculateAnalytics(attachRiskLevels(dashboardData), req.user.role);
      res.json({ message: 'File processed successfully', count: dashboardData.length, uploadId, analytics });
    })
    .on('error', (err) => {
      res.status(500).json({ error: 'Failed to process CSV file' });
    });
});

app.post('/api/upload/revert/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admin only.' });
  const idx = uploadHistory.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Upload not found.' });

  dashboardData = [...uploadHistory[idx].previousData];
  uploadHistory.splice(idx, 1);
  logAction(req.user.name, req.user.role, 'Reverted Data Upload', `Upload ID: ${req.params.id}`);
  res.json({ message: 'Upload reverted successfully' });
});

app.get('/api/upload-history', authenticateToken, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admin only.' });
  res.json(uploadHistory);
});

app.get('/api/students', authenticateToken, (req, res) => {
  let filteredData = dashboardData;
  if (req.user.role === 'Teacher') {
    filteredData = dashboardData.filter(s => s.subject === req.user.assignedSubject);
  } else if (req.user.role === 'Student') {
    filteredData = dashboardData.filter(s => s.id === req.user.linkedStudentId);
  }
  res.json({ data: attachRiskLevels(filteredData) });
});

app.get('/api/analytics', authenticateToken, (req, res) => {
  let filteredData = dashboardData;
  if (req.user.role === 'Teacher') {
    filteredData = dashboardData.filter(s => s.subject === req.user.assignedSubject);
  } else if (req.user.role === 'Student') {
    filteredData = dashboardData.filter(s => s.id === req.user.linkedStudentId);
  }
  res.json({ analytics: calculateAnalytics(attachRiskLevels(filteredData), req.user.role) });
});

app.get('/api/audit-logs', authenticateToken, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admin only access.' });
  res.json({ logs: auditLogs });
});

app.put('/api/students/:id', authenticateToken, (req, res) => {
  if (req.user.role === 'Student') return res.status(403).json({ error: 'Students cannot edit records.' });
  
  const studentId = req.params.id;
  const updateData = req.body;
  const index = dashboardData.findIndex(s => s.id === studentId);
  if (index === -1) return res.status(404).json({ error: 'Student not found' });

  if (req.user.role === 'Teacher' && dashboardData[index].subject !== req.user.assignedSubject) {
    return res.status(403).json({ error: 'Teachers can only edit their assigned students.' });
  }
  
  dashboardData[index] = { ...dashboardData[index], ...updateData };
  
  const avg = dashboardData[index].pastScores.reduce((a,b)=>a+b,0)/dashboardData[index].pastScores.length;
  if (dashboardData[index].marks > avg + 5) dashboardData[index].trend = 'Improving';
  else if (dashboardData[index].marks < avg - 5) dashboardData[index].trend = 'Declining';
  else dashboardData[index].trend = 'Stable';

  dashboardData[index].gpa = (dashboardData[index].marks / 10).toFixed(2);
  
  logAction(req.user.name, req.user.role, `Edited Student Record`, `Student ID: ${studentId}`);
  
  let filteredData = dashboardData;
  if (req.user.role === 'Teacher') {
    filteredData = dashboardData.filter(s => s.subject === req.user.assignedSubject);
  }
  res.json({ message: 'Updated', student: attachRiskLevels([dashboardData[index]])[0], analytics: calculateAnalytics(attachRiskLevels(filteredData), req.user.role) });
});

app.delete('/api/students/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Only admins can delete students.' });
  const studentId = req.params.id;
  dashboardData = dashboardData.filter(s => s.id !== studentId);
  logAction(req.user.name, req.user.role, `Deleted Student Record`, `Student ID: ${studentId}`);
  res.json({ message: 'Deleted', analytics: calculateAnalytics(attachRiskLevels(dashboardData), req.user.role) });
});

app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admin only access.' });
  res.json(users);
});

app.post('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admin only access.' });
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  logAction(req.user.name, req.user.role, `Created User`, `User: ${newUser.username}`);
  res.json({ message: 'User created', user: newUser });
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admin only access.' });
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  users[idx] = { ...users[idx], ...req.body };
  logAction(req.user.name, req.user.role, `Updated User`, `User: ${users[idx].username}`);
  res.json({ message: 'User updated', user: users[idx] });
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admin only access.' });
  const userId = parseInt(req.params.id);
  users = users.filter(u => u.id !== userId);
  logAction(req.user.name, req.user.role, `Deleted User`, `ID: ${userId}`);
  res.json({ message: 'User deleted' });
});

app.get('/api/settings', authenticateToken, (req, res) => {
  res.json(systemSettings);
});

app.put('/api/settings', authenticateToken, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admin only access.' });
  systemSettings = { ...systemSettings, ...req.body };
  logAction(req.user.name, req.user.role, `Updated Settings`, `System Settings`);
  res.json(systemSettings);
});

app.get('/api/activity', authenticateToken, (req, res) => {
  res.json(auditLogs.slice(0, 5).map(log => ({ id: log.id, text: `${log.user} (${log.role}): ${log.action} - ${log.target}`, time: log.timestamp })));
});

// Seed data — rich sample set for all roles
dashboardData.push(
  {
        id: "STU-001-Mathematics-2",
        name: "Aarav Mehta",
        subject: "Mathematics",
        marks: 45,
        attendance: 80,
        semester: "2",
        assessmentType: "Exam",
        gpa: "4.5",
        pastScores: [38, 42, 44],
        trend: "Improving",
        consistencyScore: "90.0",
        anomaly: false,
        insights: [],
        remarks: "Shows steady improvement. Encourage practice problems."
  },
  {
        id: "STU-002-Physics-1",
        name: "Priya Sharma",
        subject: "Physics",
        marks: 30,
        attendance: 40,
        semester: "1",
        assessmentType: "Exam",
        gpa: "3.0",
        pastScores: [60, 50, 40],
        trend: "Declining",
        consistencyScore: "80.0",
        anomaly: false,
        insights: ["Risk: Declining trend heavily correlated with poor attendance."],
        remarks: ""
  },
  {
        id: "STU-003-Mathematics-2",
        name: "Rohan Kapoor",
        subject: "Mathematics",
        marks: 78,
        attendance: 92,
        semester: "2",
        assessmentType: "Exam",
        gpa: "7.8",
        pastScores: [65, 70, 75],
        trend: "Improving",
        consistencyScore: "94.0",
        anomaly: false,
        insights: ["Positive: Student is excelling and showing an upward trajectory."],
        remarks: "Outstanding effort this semester."
  },
  {
        id: "STU-004-Mathematics-1",
        name: "Sneha Iyer",
        subject: "Mathematics",
        marks: 35,
        attendance: 55,
        semester: "1",
        assessmentType: "Midterm",
        gpa: "3.5",
        pastScores: [50, 44, 38],
        trend: "Declining",
        consistencyScore: "72.0",
        anomaly: false,
        insights: ["Risk: Declining trend heavily correlated with poor attendance."],
        remarks: "Requires extra tutoring sessions."
  },
  {
        id: "STU-005-Mathematics-2",
        name: "Arjun Patel",
        subject: "Mathematics",
        marks: 91,
        attendance: 98,
        semester: "2",
        assessmentType: "Exam",
        gpa: "9.1",
        pastScores: [85, 88, 90],
        trend: "Improving",
        consistencyScore: "97.0",
        anomaly: false,
        insights: ["Positive: Student is excelling and showing an upward trajectory."],
        remarks: "Top performer of the class."
  },
  {
        id: "STU-006-Mathematics-1",
        name: "Divya Nair",
        subject: "Mathematics",
        marks: 62,
        attendance: 76,
        semester: "1",
        assessmentType: "Exam",
        gpa: "6.2",
        pastScores: [60, 58, 61],
        trend: "Stable",
        consistencyScore: "88.0",
        anomaly: false,
        insights: [],
        remarks: ""
  },
  {
        id: "STU-007-Physics-2",
        name: "Karan Singh",
        subject: "Physics",
        marks: 85,
        attendance: 91,
        semester: "2",
        assessmentType: "Exam",
        gpa: "8.5",
        pastScores: [78, 81, 83],
        trend: "Improving",
        consistencyScore: "93.0",
        anomaly: false,
        insights: ["Positive: Student is excelling and showing an upward trajectory."],
        remarks: ""
  },
  {
        id: "STU-008-Physics-1",
        name: "Meera Reddy",
        subject: "Physics",
        marks: 22,
        attendance: 95,
        semester: "1",
        assessmentType: "Midterm",
        gpa: "2.2",
        pastScores: [40, 33, 28],
        trend: "Declining",
        consistencyScore: "65.0",
        anomaly: true,
        insights: ["Anomaly: Exceptionally high attendance but critically low marks."],
        remarks: ""
  },
  {
        id: "STU-009-Physics-2",
        name: "Vikram Joshi",
        subject: "Physics",
        marks: 70,
        attendance: 82,
        semester: "2",
        assessmentType: "Exam",
        gpa: "7.0",
        pastScores: [68, 69, 70],
        trend: "Stable",
        consistencyScore: "91.0",
        anomaly: false,
        insights: [],
        remarks: ""
  },
  {
        id: "STU-010-Mathematics-3",
        name: "Ananya Bose",
        subject: "Mathematics",
        marks: 55,
        attendance: 70,
        semester: "3",
        assessmentType: "Exam",
        gpa: "5.5",
        pastScores: [52, 53, 54],
        trend: "Stable",
        consistencyScore: "85.0",
        anomaly: false,
        insights: [],
        remarks: "Consistent but needs to push boundaries."
  }
)

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
