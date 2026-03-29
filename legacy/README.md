# 📊 Student Analytics Performance Dashboard

A comprehensive, production-grade web application for analyzing student performance data through interactive dashboards, advanced analytics, and intelligent risk detection.

## 🎯 Project Overview

The Student Analytics Performance Dashboard is a frontend-only application that transforms raw CSV student data into actionable academic insights. Built with vanilla JavaScript, it demonstrates enterprise-level code architecture, modular design, and modern UI/UX principles.

### Key Features

- **📁 CSV Upload & Parsing**: Drag-and-drop file upload with robust validation and error handling
- **📈 Analytics Dashboard**: Real-time calculation of key metrics (total students, averages, pass rates)
- **📊 Interactive Visualizations**: Dynamic charts using Chart.js (score distribution, subject performance, semester trends)
- **⚠️ Risk Detection**: Rule-based algorithm identifying at-risk students with visual indicators
- **🔍 Search & Filter**: Advanced filtering by name, subject, semester, and risk level
- **📉 Trend Analysis**: Performance trend detection over time
- **🌙 Dark Mode**: Full theme support with system preference detection
- **📥 Export Functionality**: Download processed data as CSV
- **💡 Smart Insights**: AI-like rule-based feedback and recommendations

## 🏗️ Project Structure

```
/
├── index.html              # Main HTML structure
├── css/
│   ├── styles.css          # Main stylesheet with responsive design
│   └── themes.css          # Dark mode theme system
├── js/
│   ├── main.js             # Application orchestration & event handling
│   ├── utils.js            # Utility functions (debounce, formatting, etc.)
│   ├── csvParser.js        # CSV parsing & validation engine
│   ├── analytics.js        # Analytics calculations & metrics
│   ├── riskDetection.js    # Risk assessment algorithms
│   ├── visualizations.js   # Chart.js integration & chart creation
│   └── filters.js          # Search, filter, and sort functionality
├── sample-data.csv         # Sample CSV file for testing
└── README.md               # This file
```

## 🛠️ Technology Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern CSS with custom properties, flexbox, and grid
- **Vanilla JavaScript (ES6+)**: Modular, class-based architecture
- **Chart.js 4.4.0**: Interactive data visualizations
- **No Dependencies**: Pure frontend, no build tools required

## 🚀 Getting Started

### Local Development

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. Upload a CSV file using the provided sample or your own data

### CSV Format

Your CSV file should include the following columns (case-insensitive):

- **Student ID** / **ID**: Unique student identifier
- **Name** / **Student Name**: Student's full name
- **Subject** / **Course**: Subject name
- **Marks** / **Score** / **Grade**: Numeric score (0-100)
- **Attendance** / **Attendance Percentage**: Attendance percentage (0-100)
- **Semester** / **Term**: Semester number
- **Assessment Type** / **Assessment**: Type of assessment (optional)

#### Sample CSV Format

```csv
Student ID,Name,Subject,Marks,Attendance,Semester,Assessment Type
STU001,John Doe,Mathematics,85,92,1,Exam
STU002,Jane Smith,Physics,78,88,1,Exam
STU003,Bob Johnson,Chemistry,45,65,1,Exam
```

## 📦 GitHub Pages Deployment

### Method 1: Automatic Deployment

1. Push this repository to GitHub
2. Go to repository Settings → Pages
3. Select source branch (usually `main` or `master`)
4. Save - GitHub Pages will automatically deploy
5. Access your dashboard at: `https://[username].github.io/[repository-name]/`

### Method 2: Manual Deployment

1. Ensure all files are committed to your repository
2. Push to GitHub
3. Enable GitHub Pages in repository settings
4. Your site will be live within minutes

### Important Notes for GitHub Pages

- ✅ All paths are relative (no absolute paths)
- ✅ No server-side code required
- ✅ Works with GitHub's CDN
- ✅ HTTPS enabled by default
- ✅ Custom domain support available

## 🎨 Features in Detail

### CSV Processing

- **Robust Parsing**: Handles quoted values, commas in data, and various formats
- **Data Validation**: Automatic type conversion and range clamping
- **Error Handling**: Detailed error messages for malformed data
- **Flexible Headers**: Accepts various column name formats

### Analytics Engine

- **Real-time Calculations**: Instant metric updates
- **Multi-dimensional Analysis**: Subject-wise, semester-wise breakdowns
- **Performance Rankings**: Top and bottom performer identification
- **Distribution Analysis**: Score and attendance range distributions

### Risk Detection

- **Multi-factor Assessment**: Considers scores, attendance, and combinations
- **Weighted Algorithm**: Rule-based scoring system
- **Risk Levels**: High, Medium, Low, None classifications
- **Factor Identification**: Detailed risk factor explanations

### Visualizations

- **Score Distribution**: Bar chart showing score ranges
- **Subject Performance**: Line chart comparing subject averages
- **Semester Trends**: Combined bar/line chart for trends
- **Attendance Overview**: Doughnut chart for attendance distribution

### User Interface

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Full theme support with persistence
- **Accessibility**: ARIA labels, keyboard navigation, focus indicators
- **Animations**: Smooth transitions and hover effects
- **Loading States**: Visual feedback during processing

## 🔧 Customization

### Changing Color Scheme

Edit CSS variables in `css/styles.css`:

```css
:root {
    --primary-color: #4f46e5;
    --secondary-color: #10b981;
    /* ... */
}
```

### Adjusting Risk Thresholds

Modify rules in `js/riskDetection.js`:

```javascript
{
    name: 'Low Score',
    weight: 0.4,
    check: (student) => (student.marks || 0) < 40  // Adjust threshold
}
```

### Adding New Metrics

Extend `analytics.js` with new calculation methods and update `updateMetrics()` in `main.js`.

## 📊 Sample Data

A sample CSV file (`sample-data.csv`) is included for testing. It contains:
- 50+ student records
- Multiple subjects (Mathematics, Physics, Chemistry, Biology)
- Various semesters
- Diverse score and attendance ranges

## 🎓 Academic Use

This project demonstrates:
- **Software Architecture**: Modular, scalable code structure
- **Data Processing**: CSV parsing and transformation
- **Analytics**: Statistical calculations and aggregations
- **Visualization**: Interactive chart creation
- **UI/UX Design**: Modern, responsive interface
- **Error Handling**: Robust validation and user feedback
- **Code Quality**: Clean, documented, maintainable code

## 🚀 Future Enhancements

- **Machine Learning**: Predictive analytics for student success
- **Backend Integration**: API connections for real-time data
- **Advanced Visualizations**: Heatmaps, correlation matrices
- **Export Options**: PDF reports, Excel format
- **User Authentication**: Multi-user support with roles
- **Real-time Updates**: WebSocket integration for live data
- **Mobile App**: React Native or Progressive Web App version

## 📝 License

This project is created for educational purposes. Feel free to use, modify, and distribute.

## 👨‍💻 Development Notes

- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Performance**: Optimized for datasets up to 10,000 records
- **File Size Limit**: 10MB CSV files
- **No External Dependencies**: Except Chart.js CDN (can be self-hosted)

## 🐛 Troubleshooting

### Charts Not Displaying
- Ensure Chart.js CDN is loading (check browser console)
- Verify data is properly formatted

### CSV Not Parsing
- Check CSV format matches expected structure
- Ensure file encoding is UTF-8
- Verify no special characters breaking parsing

### Dark Mode Not Working
- Clear browser localStorage and reload
- Check browser supports CSS custom properties

## 📧 Support

For issues or questions, please check:
1. Browser console for error messages
2. CSV file format matches requirements
3. All JavaScript files are loading correctly

---

**Built with precision for academic excellence** 🎓
