import React, { useRef } from 'react';
import { BiUpload, BiFile } from 'react-icons/bi';

const UploadSection = ({ onUpload }) => {
  const fileInputRef = useRef();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <section className="upload-section animate__animated animate__zoomIn">
      <div className="upload-card">
        <div className="upload-icon">📁</div>
        <h2>Upload Student Data</h2>
        <p className="upload-description">
          Drag and drop your CSV file here, or click to browse
        </p>
        <div 
          className="upload-area" 
          onDragOver={handleDragOver} 
          onDragLeave={handleDragLeave} 
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            accept=".csv" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
          <div className="upload-placeholder">
            <span className="upload-icon-large">📤</span>
            <p>Drop CSV file here or <span className="browse-link" style={{textDecoration: 'underline'}}>browse</span></p>
            <small>Supports: Student ID, Name, Subject, Marks, Attendance, Semester, Assessment Type</small>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
