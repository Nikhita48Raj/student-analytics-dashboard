import React, { useState } from 'react';
import axios from 'axios';
import StudentsTable from './StudentsTable';
import StudentModal from './StudentModal';
import CompareModal from './CompareModal';
import EditStudentModal from './EditStudentModal';
import { API_BASE_URL } from '../config';

const StudentsView = ({ students, onRefresh }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showCompare, setShowCompare] = useState(false);

  const handleDelete = async (student) => {
    if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_BASE_URL}/students/${student.recordId ?? student.id}`);
        onRefresh();
      } catch (err) {
        console.error("Delete failed", err);
        alert("Failed to delete record.");
      }
    }
  };

  return (
    <div className="students-view animate__animated animate__fadeIn">
      <div className="dashboard-header-inner" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h2 className="futuristic-title" style={{ fontSize: '2rem' }}>Student Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>View, filter, edit, and delete detailed student records.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="futuristic-btn" 
            onClick={() => setShowCompare(true)}
            style={{ background: 'var(--secondary-color)', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ⚖️ Compare Students
          </button>
          <button 
            className="futuristic-btn outline" 
            onClick={onRefresh}
            style={{ border: '2px solid var(--primary-color)', color: 'var(--text-primary)', background: 'transparent', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🔄 Refresh List
          </button>
        </div>
      </div>

      <StudentsTable 
         students={students} 
         onRowClick={setSelectedStudent} 
         onEditClick={setEditingStudent}
         onDeleteClick={handleDelete}
      />

      {/* Local Modals */}
      <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      {showCompare && <CompareModal students={students} onClose={() => setShowCompare(false)} />}
      <EditStudentModal student={editingStudent} onClose={() => setEditingStudent(null)} onRefresh={onRefresh} />
    </div>
  );
};

export default StudentsView;
