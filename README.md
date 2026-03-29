# Student Analytics Performance Dashboard (Full-Stack)

A comprehensive, production-grade web application for analyzing student performance data through interactive dashboards and advanced analytics. Originally a frontend-only Vanilla JS project, it has now been fully upgraded into a **React** + **Node.js/Express** full-stack application.

## 🏗️ Project Architecture

```
/
├── backend/                # Node.js + Express Backend
│   ├── uploads/            # Temporary directory for CSV uploads
│   ├── package.json        # Backend dependencies
│   └── server.js           # Express API server & CSV parser
│
├── frontend/               # React + Vite Frontend
│   ├── index.html          # Main HTML entry
│   ├── src/                # React source code components & styles
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite Configuration
│
└── legacy/                 # Original Vanilla JS source files (Archived)
```

## 🚀 Getting Started

To run the application locally, you will need to start both the backend and frontend servers in separate terminal instances.

### 1. Start the Backend

Open a terminal window and execute:
```bash
cd backend
npm install
node server.js
```
The backend server will run on `http://localhost:5000`.

### 2. Start the Frontend

Open a second terminal window and execute:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will be hosted on `http://localhost:5173`. Open this URL in your browser to view the dashboard!

## 🎯 Features Showcase

- **REST API + Multer File Uploads**: Upload CSV data to a real backend, parsed asynchronously and handled properly over an HTTP endpoints (`POST /api/upload`, `GET /api/students`, `GET /api/analytics`).
- **React Components**: Breaking down the UI cleanly into reusable components (Metrics, Charts, Students Table, Header).
- **Chart.js Port**: React equivalents for charting (`react-chartjs-2`).
- **Interactive UI**: Futuristic themed styles ported from the legacy implementation, featuring dark mode toggle via `data-theme` attribute mechanism.

## 📊 Sample Data

You can find the original schema test data in `legacy/sample-data.csv` to try out the upload component!
