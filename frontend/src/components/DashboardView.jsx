import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import NLSearchBar from './NLSearchBar';

const DashboardView = ({ analytics, activityList, students, userRole }) => {
  const [filteredStudents, setFilteredStudents] = useState(students);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  const dashboardTarget = () => {
    if (userRole === 'Admin') {
      return <AdminDashboard analytics={analytics} activityList={activityList} students={filteredStudents} />;
    } else if (userRole === 'Teacher') {
      return <TeacherDashboard analytics={analytics} activityList={activityList} students={filteredStudents} />;
    } else if (userRole === 'Student') {
      return <StudentDashboard analytics={analytics} activityList={activityList} students={filteredStudents} />;
    } else {
      return <div>Invalid Role</div>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
       {userRole !== 'Student' && (
         <NLSearchBar students={students} onFilter={setFilteredStudents} />
       )}
       {dashboardTarget()}
    </div>
  );
};

export default DashboardView;
