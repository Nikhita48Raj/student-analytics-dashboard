import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { getStudentRecordKey } from '../utils/studentRecord';

const EditStudentModal = ({ student, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({ ...student });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({ ...student });
  }, [student]);

  if (!student) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/students/${getStudentRecordKey(student)}`, formData);
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Failed to update student", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={onClose}>
      <div className="modal-container futuristic-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%' }}>
        <div className="modal-header futuristic-header">
          <h2 className="futuristic-title">Edit Record: {student.name}</h2>
          <button className="modal-close futuristic-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-content" style={{ padding: '1.5rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '5px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Subject</label>
            <input type="text" name="subject" value={formData.subject} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '5px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} required />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Score (%)</label>
              <input type="number" name="marks" value={formData.marks} onChange={handleChange} min="0" max="100" style={{ width: '100%', padding: '0.8rem', borderRadius: '5px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Attendance (%)</label>
              <input type="number" name="attendance" value={formData.attendance} onChange={handleChange} min="0" max="100" style={{ width: '100%', padding: '0.8rem', borderRadius: '5px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
             <button type="button" onClick={onClose} className="futuristic-btn outline" style={{ flex: 1, padding: '10px', background: 'transparent', border: '2px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
             <button type="submit" className="futuristic-btn" disabled={loading} style={{ flex: 1, padding: '10px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                {loading ? 'Saving...' : 'Save Changes'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
