# 🧠 SIS Nexus — Student Analytics Dashboard

![Platform](https://img.shields.io/badge/Platform-SIS%20Nexus-00FFFF?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-00FF00?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge\&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-43853D?style=for-the-badge\&logo=node.js)
![License](https://img.shields.io/badge/License-Academic-blue?style=for-the-badge)

---

## 📌 Overview

**SIS Nexus** is a full-stack **Student Information System (SIS)** designed to transform raw academic data into **interactive, intelligent, and actionable insights**.

It goes beyond traditional dashboards by combining:

* 📊 Advanced data visualization
* 🧠 Insight-driven analytics
* ⚡ Real-time interactivity
* 🔐 Role-based system design

---

## ✨ Key Features

### 🔍 Natural Language Search (OmniSearch™)

* Query data using plain English:

  ```
  attendance < 60
  marks > 80
  high risk
  ```
* Search students by name instantly
* Real-time filtering across the entire dashboard

---

### 📊 Interactive Analytics Dashboard

* KPI cards:

  * GPA average
  * At-risk students
  * Attendance rate
* Fully interactive charts:

  * Click → filter entire dashboard
  * Linked visualizations

---

### 🧠 Smart Insights Engine

* Trend detection:

  * Improving / Declining / Stable
* Risk detection:

  * Academic + attendance-based
* Automated recommendations:

  * “Focus on Physics”
  * “Attendance needs improvement”

---

### 🔐 Role-Based Access Control (RBAC)

| Role          | Capabilities                                     |
| ------------- | ------------------------------------------------ |
| 🛡️ Admin     | Full system control, audit logs, data management |
| 👨‍🏫 Teacher | Class analytics, student monitoring              |
| 🎓 Student    | Personal dashboard, performance insights         |

---

### 📂 CSV Data Management

* Drag-and-drop upload
* Data validation before upload
* Duplicate detection
* Rollback support

---

### 📈 Advanced Visualizations

* Bar charts
* Line graphs
* Doughnut charts
* Heatmaps
* Radar charts

---

### ⚡ UX Enhancements

* Skeleton loading (no blank screens)
* Smooth transitions & animations
* Responsive design
* Real-time updates

---

## 🏗️ System Architecture

```
Frontend (React + Vite)
        ↓
REST API (Node.js + Express)
        ↓
Data Processing (CSV / In-Memory / Extendable DB)
```

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* Chart.js (`react-chartjs-2`)
* CSS (Glassmorphism UI)
* Axios

### Backend

* Node.js
* Express.js
* Multer (file uploads)
* csv-parser
* JWT Authentication

---

## 🚀 Getting Started

### 📦 Prerequisites

* Node.js (v16 or above)
* npm or yarn

---

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/student-analytics-dashboard.git
cd student-analytics-dashboard
```

---

### 2️⃣ Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 3️⃣ Run Application

```bash
# Backend (Port 5000)
cd backend
npm run dev
# or
node server.js

# Frontend (Port 5173)
cd frontend
npm run dev
```

---

### 4️⃣ Access Application

Open in browser:

```
http://localhost:5173
```

---

## 🔑 Demo Credentials

| Role    | Username | Password |
| ------- | -------- | -------- |
| Admin   | admin    | password |
| Teacher | teacher  | password |
| Student | student  | password |

### ⚡ Smart Login

Use any student name:

```
Aarav / Rohan / Meera
Password: password
```

---

## 📸 Screenshots


```
/screenshots/dashboard.png
/screenshots/analytics.png
/screenshots/students.png
/screenshots/reports.png
```

---

## 🎯 Use Cases

* Academic performance tracking
* Student risk detection
* Institutional analytics dashboards
* Data visualization projects

---

## 🧪 Future Enhancements

* Database integration (MongoDB/PostgreSQL)
* AI-based predictive analytics
* Real-time WebSocket updates
* Notification system

---


## 👨‍💻 Authors

**Nikhita R S** **Raghav S**

---

